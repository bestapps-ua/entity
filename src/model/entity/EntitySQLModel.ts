'use strict';

import Entity from "../../entity/Entity";
import IEntitySQLModelOptions from "../../interface/entity/sql/IEntitySQLModelOptions";
import IEntitySQLModel from "../../interface/entity/sql/IEntitySQLModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsCountParams from "../../interface/entity/items/IEntityItemsCountParams";
import EntityBaseSQLModel from "./EntityBaseSQLModel";
import IEntitySQLMakeScheme from "../../interface/entity/sql/IEntitySQLMakeScheme";
import IEntityResponse from "../../interface/entity/IEntityResponse";
import IEntitySQLMakeResponse from "../../interface/entity/sql/make/IEntitySQLMakeResponse";
import IEntitySQLMakeListResponse from "../../interface/entity/sql/make/IEntitySQLMakeListResponse";
import globalEventModel from "../event/GlobalEventModel";
import {EVENT_ENTITY_CREATED} from "../event/Events";

let uuid4 = require('uuid/v4');

class EntitySQLModel extends EntityBaseSQLModel implements IEntitySQLModel {

    public options: IEntitySQLModelOptions;
    protected _table: string;
    private _sql: any;

    constructor(options: IEntitySQLModelOptions) {
        super(options);
        this.table = options.table;
        this.sql = options.sql;
        this.options.schemas = this.options.schemas || [];
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
            this.options.schemas.push(field);
        }
    }

    get table(): string {
        if (!this._table) throw 'Please init options.table';
        return this._table;
    }

    get tableEscaped(): string {
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
        let schemas = this.options.schemas;
        if (!schemas) throw 'Please init options.schemas';
        return schemas;
    }

    get(id: string | number, callback: IEntityResponse) {
        this.cacheGet(id, (err, item) => {
            if (item) {
                return callback && callback(undefined, item);
            }
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
        if (!data) {
            return callback && callback({data, errors: [{error: `no data provided in ${this.constructor.name}.make`}]});
        }
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
                const entityId = source.id;
                if (source.model) {
                    if (schema.source.model === 'this') {
                        schema.source.model = this;
                    }
                    const model = schema.source.model as IEntitySQLModel;

                    if (schema.source.optional && !data[entityId]) {
                        return resolve(item);
                    }
                    try {
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
                if (schema.type && schema.type === 'json') {
                    item = item ? JSON.parse(item) : {};
                }

                itemData[schema.field] = item;
                resolve(item);
            }));
        }
        Promise.all(p).then(() => {
            callback && callback(errors.length > 0 ? {data, errors} : undefined, itemData);
        }).catch((err) => {
            callback && callback({data, errors: [{error: err}]}, itemData);
        });
    }

    getByUid(uid: string, callback) {
        this.getOneByParams([{key: 'uid', value: uid}], callback);
    }

    async getByUidAsync(uid: string): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.getByUid(uid, (err, item) => {
                if (err) return reject(err);
                resolve(item);
            });
        });
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

        Promise.all(p).then((items: [Entity]) => {
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

        Promise.all(p).then((items: [Entity]) => {
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


    protected getEntityClassesInvolved() {
        let classes = [
            this.entity,
        ];
        let models = {};
        this.getEntityClassesNext(classes, models);
        return classes;
    }

    protected getEntityClassesNext(classes, models) {
        let schemas = this.schemas;
        for (const schema of schemas) {
            if (!schema.source) continue;
            let source = schema.source;
            if (!source.model) continue;
            if (source.model === 'this') continue;
            let model = source.model.constructor.name;
            if (models[model]) continue;
            models[model] = true;
            let m = source.model as IEntitySQLModel;
            classes.push(m.entity);
            m.getEntityClassesNext(classes, models);
        }
    }

    public async createAsync(entity: Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            let p = [];
            for (const schema of this.schemas) {
                if (schema.field === 'id') continue;
                p.push(new Promise(async (res, rej) => {
                    try {
                        let val = await entity[schema.field];
                        const isSource = schema.source;
                        if (isSource) {
                            if (val) {
                                val = val.id;
                            }
                        } else {
                            if (schema.type && schema.type === 'json') {
                                val = JSON.stringify(val);
                            }
                        }
                        val = await this.beforeCreate(schema.field, val);
                        res({
                            field: isSource ? schema.source.id : schema.field,
                            value: val,
                        });
                    } catch (err) {
                        rej(err);
                    }
                }));
            }
            Promise.all(p).then((items) => {
                let ins: any = {};
                for (const item of items) {
                    ins[item.field] = item.value;
                }
                this.sql.insertQueryAll(this.table, [ins], async (err, id) => {
                    if (err || !id) {
                        err = err || 'no id provided';
                        console.log('[err create insert]', err, entity);
                        return reject(err);
                    }
                    try {
                        let createdEntity = await this.getAsync(id);
                        if (!createdEntity) {
                            throw 'not found'
                        }
                        globalEventModel.getEmitter().emit(EVENT_ENTITY_CREATED, {entity: createdEntity});
                        resolve(createdEntity);
                    } catch (err) {
                        console.log('[err create get]', err, id, entity);
                        reject(err);
                    }
                });
            }).catch((err) => {
                console.log('[err create]', err, entity);
                resolve(err);
            });
        });
    }

    public create(entity: Entity, callback) {
        (async () => {
            try {
                let res = await this.createAsync(entity);
                callback && callback(undefined, res);
            } catch (err) {
                callback && callback(err);
            }
        })();
    }

    protected async beforeCreate(field: string, value: any) {
        if (!value) {
            if (field === 'created') {
                value = Date.now() / 1000;
            }

            if (field === 'uid') {
                value = await this.generateUidAsync();
            }
        }
        return value;
    }


    /**
     *
     * @param callback
     */
    generateUid(callback) {
        let uid = uuid4();
        this.getByUid(uid, (err, user) => {
            if (err) return callback && callback(err);
            if (user) return this.generateUid(callback);
            callback && callback(undefined, uid);
        });
    }

    async generateUidAsync(): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.generateUid((err, uid) => {
                if (err) return reject(err);
                resolve(uid);
            });
        });
    }

}

export default EntitySQLModel;
