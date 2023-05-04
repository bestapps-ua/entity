'use strict';

import Entity from "../../entity/Entity";
import IEntitySQLModelOptions from "../../interface/entity/sql/IEntitySQLModelOptions";
import IEntitySQLModel from "../../interface/entity/sql/IEntitySQLModel";
import EntityModel from "./EntityModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";
import IEntityItemsFilter from "../../interface/entity/items/IEntityItemsFilter";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsCountParams from "../../interface/entity/items/IEntityItemsCountParams";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import EntityBaseSQLModel from "./EntityBaseSQLModel";
import IEntitySQLMakeScheme from "../../interface/entity/sql/IEntitySQLMakeScheme";
import IEntityResponse from "../../interface/entity/IEntityResponse";
import IEntitySQLMakeResponse from "../../interface/entity/sql/make/IEntitySQLMakeResponse";
import IEntitySQLMakeListResponse from "../../interface/entity/sql/make/IEntitySQLMakeListResponse";

class EntitySQLModel extends EntityBaseSQLModel implements IEntitySQLModel {

    public options: IEntitySQLModelOptions;
    protected _table: string;
    private _sql: any;

    constructor(options: IEntitySQLModelOptions) {
        super(options);
        this.table = options.table;
        this.sql = options.sql;
        this.options.make = this.options.make || {
            schemas: [],
        }
        this._fillDefault();
    }

    private _fillDefault() {
        const fields = [
            {
                field: 'id',
            },
            {
                field: 'uid',
            },
            {
                field: 'created',
            }
        ];
        for (const field of fields) {
            this.options.make.schemas.push(field);
        }
    }

    get table(): string {
        if (!this._table) throw 'Please init options.table';
        return this._table;
    }

    protected tableEscaped(): string {
        let table = this.table;
        return this.escapeField(table);
    }

    set table(value) {
        this._table = value;
    }

    get sql(): any {
        if (!this._sql) throw 'Please init options.sql';
        return this._sql;
    }

    set sql(value: any) {
        this._sql = value;
    }

    get schemas(): IEntitySQLMakeScheme[] {
        let schemas = this.options.make.schemas;
        if (!schemas) throw 'Please init options.make.schemas';
        return schemas;
    }

    get(id: string | number, callback: IEntityResponse) {
        this.cacheGet(id, (err, item) => {
            if (item) return callback && callback(undefined, item);
            this.sql.getOne(
                'SELECT * ' +
                'FROM ' + this.tableEscaped + ' ' +
                'WHERE id = ? ' +
                'LIMIT 1',
                id,
                (err, row) => {
                    if (err || !row) {
                        return callback && callback(err);
                    }
                    this.make(row, async (err, itemData) => {
                        if (err) return callback && callback(err);
                        //@ts-ignore
                        let entity = new this._entity(itemData);
                        await this.cacheSetAsync(id, entity);
                        callback && callback(undefined, entity);
                    });
                }
            );
        });
    }

    async getAsync(id: string | number): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.get(id, (err, item) => {
                if (err) return reject(err);
                resolve(item);
            });
        });
    }

    public make(data: any, callback: IEntitySQLMakeResponse) {
        let itemData = {
            id: data.id,
            uid: data.uid,
            created: data.created,
        };
        let p = [];
        let errors = [];
        let schemas = this.schemas;
        for (const schema of schemas) {
            p.push(new Promise(async (resolve, reject) => {
                let item = undefined;
                let source = schema.source ? schema.source : {
                    id: schema.field,
                }
                const entityId = schema.source.id;
                if (source.model) {
                    if (schema.source.model === 'this') {
                        schema.source.model = this;
                    }
                    const model = schema.source.model as IEntitySQLModel;

                    if (schema.source.optional && !data[entityId]) {
                        return resolve(item);
                    }
                    try {
                        //TODO: lazy load from config
                        if (schema.source.isLazy) {
                            item = (() => {
                                return function lazy() {
                                    return (async () => {
                                        try {
                                            return await model.getAsync(data[entityId]);
                                        } catch (e) {
                                            console.log('[error lazy load]', entityId, e);
                                        }
                                    });
                                }
                            })();
                        } else {
                            item = await model.getAsync(data[entityId]);
                        }
                    } catch (e) {
                        errors.push({
                            field: schema.field,
                            sourceId: entityId,
                            error: e,
                        });
                    }
                } else {
                    item = data[entityId];
                }
                itemData[schema.field] = item;
                resolve(item);
            }));
        }
        callback && callback(errors.length > 0 ? {data, errors} : undefined, itemData);
    }

    /**
     * @param data
     */
    public async makeAsync(data: any): Promise<object> {
        return new Promise((resolve, reject) => {
            this.make(data, (err, item) => {
                if (err) return reject(err);
                resolve(item);
            });
        });
    }

    public makeList(err, rows, callback: IEntitySQLMakeListResponse) {
        if (err) {
            return callback && callback(err, []);
        }
        if (!rows || rows.length === 0) return callback && callback(undefined, []);
        let p = [];
        for (let i = 0; i < rows.length; i++) {
            p.push(new Promise((resolve, reject) => {
                this.get(rows[i].id, (err, item) => {
                    if (!item) return reject(err);
                    resolve(item);
                });
            }));
        }

        Promise.all(p).then((items) => {
            callback && callback(undefined, items);
        }).catch((err) => {
            callback && callback(err, []);
        });
    }

    public async makeListAsync(err, rows): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            this.makeList(err, rows, (err, items) => {
                if (err) return reject(err);
                resolve(items);
            });
        });
    }

    public makeListOnly(err, rows, callback: IEntitySQLMakeListResponse) {
        if (err) {
            return callback && callback(err, []);
        }
        if (!rows || rows.length === 0) return callback && callback(undefined, []);
        let p = [];
        for (let i = 0; i < rows.length; i++) {
            p.push(new Promise(async (resolve, reject) => {
                let row = rows[i];
                try {
                    let itemData = await this.makeAsync(row);
                    //@ts-ignore
                    let entity = new this._entity(itemData);
                    resolve(entity);
                } catch (e) {
                    reject(e);
                }
            }));
        }

        Promise.all(p).then((items) => {
            callback && callback(undefined, items);
        }).catch((err) => {
            callback && callback(err, []);
        });
    }

    public async makeListOnlyAsync(err, rows): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            this.makeListOnly(err, rows, (err, items) => {
                if (err) return reject(err);
                resolve(items);
            });
        });
    }

    getOneByParams(params: IEntityItemsWhere | IEntityItemsWhere[], callback: IEntityResponse) {
        let {names, values} = this.processWhere(params);
        let q = `
            SELECT *
            FROM ${this.tableEscaped}
            WHERE ` + names.join(' AND ') + ' LIMIT 1'
        ;
        this.sql.getOne(q, values, (err, row) => {
            if (err || !row) return callback && callback(err);
            this.get(row.id, callback);
        });
    }

    async getOneByParamsAsync(params: IEntityItemsWhere | IEntityItemsWhere[]): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.getOneByParams(params, (err, item) => {
                if (err) return reject(err);
                resolve(item);
            });
        });
    }

    getAllByParams(params: IEntityItemsWhere | IEntityItemsWhere[], callback: IEntitySQLMakeListResponse) {
        let {names, values} = this.processWhere(params);
        let q = `
            SELECT *
            FROM ${this.tableEscaped}
            WHERE ${names.join(' AND ')}
            ORDER BY id ASC`
        ;
        this.sql.query(q, values, (err, rows) => {
            this.makeList(err, rows, callback);
        });
    }

    async getAllByParamsAsync(params: IEntityItemsWhere | IEntityItemsWhere[]): Promise<Entity[]> {
        return new Promise((resolve, reject) => {
            this.getAllByParams(params, (err, items) => {
                resolve(items);
            });
        });
    }

    /**
     * @param params
     * @param callback
     */
    getItems(params: IEntityItemsParams, callback: IEntitySQLMakeListResponse) {
        params.sort = params.sort || {field: this.escapeField(this.table + '.id'), order: 'ASC'};
        params.select = params.select || `${this.tableEscaped}.*`;
        let query = this.processSelect(params.select) + ' ';
        query += `FROM ${this.tableEscaped} `;
        let {q, values} = this.processFilter(params.filters);
        query += q;

        query += this.processGroup(params.group);
        query += this.processSort(params.sort);

        if (params.limit) {
            params.page = params.page || 1;
            query += 'LIMIT ' + params.limit + ' OFFSET ' + (params.page * params.limit - params.limit);
        }

        this.sql.query(query, values, (err, rows) => {
            if (params.native) {
                return callback && callback(err, rows);
            }
            this.makeList(err, rows, callback);
        });
    }

    getItemsAsync(params: IEntityItemsParams, options): Promise<Entity[] | any[]> {
        return new Promise((resolve, reject) => {
            this.getItems(params, (err, items) => {
                resolve(items);
            });
        });
    }

    /**
     * @param params
     * @param callback
     */
    getItemsCount(params: IEntityItemsCountParams, callback) {
        let query = `
            SELECT COUNT(*) cnt
            FROM ${this.tableEscaped}
        `;
        let {q, values} = this.processFilter(params.filters);
        query += q;

        query += this.processGroup(params.group);

        query += `LIMIT 1`;
        this.sql.getOne(query, values, (err, row) => {
            let cnt = 0;
            if (row) cnt = row.cnt;
            callback && callback(err, cnt);
        });
    }

    getItemsCountAsync(params: IEntityItemsCountParams): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getItemsCount(params, (err, item) => {
                resolve(item);
            });
        });
    }

    remove(item: Entity, callback) {
        let q = `
            DELETE
            FROM ${this.tableEscaped}
            WHERE id = ?
            LIMIT 1
        `;
        this.sql.query(q, item.id, async (err) => {
            await this.cacheInvalidateAsync(item.id);
            callback && callback(err);
        });
    }

    async removeAsync(item: Entity) {
        return new Promise((resolve, reject) => {
            this.remove(item, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    async truncate() {
        return new Promise((resolve, reject) => {
            let q = `TRUNCATE ${this.tableEscaped}`;
            this.sql.query(q, undefined, async () => {
                await this.invalidateAll();
                resolve();
            });
        });

    }
}

export default EntitySQLModel;
