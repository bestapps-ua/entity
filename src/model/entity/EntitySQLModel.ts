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
import {
    EVENT_ENTITY_CREATED,
    EVENT_ENTITY_UPDATED,
    EVENT_SQL_MODEL_LOADED,
    EVENT_SQL_MODEL_LOADING,
    EVENT_SQL_CONNECTED
} from "../event/Events";
import RegistryModel from "../RegistryModel";

let uuid4 = require('uuid/v4');

class EntitySQLModel extends EntityBaseSQLModel implements IEntitySQLModel {

    public options: IEntitySQLModelOptions;
    protected _table: string;
    private _sql: any;

    protected specialFields = {
        uid: {
            name: 'uid',
            isFound: false,
        },
        created: {
            name: 'created',
            isFound: false,
        },
    };

    constructor(options: IEntitySQLModelOptions) {
        super(options);
        this.table = options.table;
        this.options.schemas = this.options.schemas || [];
        this._fillDefault();
        globalEventModel.getEmitter().on(EVENT_SQL_CONNECTED, async () => {
            globalEventModel.getEmitter().emit(EVENT_SQL_MODEL_LOADING, {model: this});
            this.autoFindFields();
        });
    }

    init() {

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

        //searching in main schema special fields
        for (const schema of this.options.schemas) {
            if (!schema.type || ['uid', 'created'].indexOf(schema.type) === -1) continue;
            this.specialFields[schema.type].isFound = true;
            const fieldId = schema.source ? schema.source.id : schema.field;
            this.specialFields[schema.type].name = fieldId;
        }

        for (const field of fields) {
            let special = this.specialFields[field.field];
            //exclude default if found already
            if (special && special.isFound) {
                continue;
            }
            this.options.schemas.push(field);
        }
    }

    private autoFindFields() {
        let q = `
            DESCRIBE ${this.tableEscaped}
        `;
        this.sql.query(q, undefined, async (err, rows) => {
            try {
                await new Promise((resolve, reject) => {
                    if (err || !rows) return reject(err || `error DESCRIBE ${this.tableEscaped}`);
                    for (const row of rows) {
                        let field = row['Field'].toLowerCase();
                        for (const name in this.specialFields) {
                            let specialField = this.specialFields[name];
                            if (specialField.name.toLowerCase() === field) {
                                specialField.isFound = true;
                            }
                        }
                        //TODO: check schema and alert if not found in list
                    }
                    globalEventModel.getEmitter().emit(EVENT_SQL_MODEL_LOADED, {model: this});
                });
            } catch (err) {
                console.log('[err autoFindFields]', err);
            }
        });
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
        if (!this._sql) {
            this._sql = RegistryModel.get('sql');
            if (!this._sql) {
                throw 'Please set in Registry - sql';
            }
        }
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
        async function processCallback(id, callback) {
            return await new Promise((res, rej) => {
                callback(id, (err, entity: Entity) => {
                    if (err) return rej(err);
                    res(entity);
                });
            });
        }

        if (!data) {
            return callback && callback({data, errors: [{error: `no data provided in ${this.constructor.name}.make`}]});
        }
        let t1 = Date.now();
        let itemData = {
            id: data.id,
            uid: data[this.specialFields.uid.name],
            system: {
                isCache: false,
                ttl: 0,
            },
            created: data[this.specialFields.created.name],
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

                    if (schema.optional && !data[entityId]) {
                        return resolve(item);
                    }
                    try {
                        if (schema.isLazy) {
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
                } else if (source.callback) {
                    if (schema.optional && !data[entityId]) {
                        return resolve(item);
                    }
                    if (schema.isLazy) {
                        item = (() => {
                            return function lazy() {
                                return (async () => {
                                    try {
                                        return await processCallback(data[entityId], source.callback);
                                    } catch (e) {
                                        console.log('[error callback lazy load]', entityId, e);
                                    }
                                });
                            }
                        })();
                    } else {
                        try {
                            item = await processCallback(data[entityId], source.callback);
                        } catch (e) {
                            console.log('err make by callback', e);
                        }
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
            itemData.system.ttl = Date.now() - t1;
            if (this.options.make && this.options.make.onAfter) {
                this.options.make.onAfter(data, itemData, () => {
                    itemData.system.ttl = Date.now() - t1;
                    callback && callback(errors.length > 0 ? {data, errors} : undefined, itemData);
                });
            }else{
                callback && callback(errors.length > 0 ? {data, errors} : undefined, itemData);
            }
        }).catch((err) => {
            itemData.system.ttl = Date.now() - t1;
            callback && callback({data, errors: [{error: err}]}, itemData);
        });
    }

    getByUid(uid: string, callback) {
        if (!this.specialFields.uid.isFound) {
            console.log('[err getByUid]', `uid field was not found, using it as id instead`);
            return this.get(uid, callback);
        }
        this.getOneByParams([{key: this.specialFields.uid.name, value: uid}], callback);
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
                    if (!item) return reject(err || `${rows[i].id} not found`);
                    resolve(item);
                });
            }));
        }

        Promise.all(p).then((items: [Entity]) => {
            //console.log(items);
            callback && callback(undefined, items);
        }).catch((err) => {
            console.log('err makeList', err);
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
        let query = '';
        let values = [];
        let res: any = this.processSelect(this.tableEscaped, params.select);
        query += res.query + ' ';
        if(res.values.length > 0) {
            values = values.concat(res.values);
        }
        query += `FROM ${this.tableEscaped} `;
        res = this.processFilters(params);
        query += res.q + ' ';
        if(res.values.length > 0) {
            values = values.concat(res.values);
        }

        query += this.processGroup(params.group);
        res = this.processHaving(params.having);
        query += res.q + ' ';
        if(res.values.length > 0) {
            values = values.concat(res.values);
        }
        res = this.processSort(params.sort);
        query += res.query;
        if(res.values.length > 0) {
            values = values.concat(res.values);
        }

        if (params.limit) {
            params.page = params.page || 1;
            query += `LIMIT ${(params.page * params.limit - params.limit)}, ${params.limit}`;
        }
        //TODO: return RESULT SQL and VALUES for better debug!
        //console.log(query, values);
        this.sql.query(query, values, (err, rows) => {
            let e;
            if(err) {
                e = {
                    err,
                    query,
                    values,
                };
            }
            if (params.native) {
                return callback && callback(e, rows);
            }
            this.makeListOnly(e, rows, callback);
        });
    }

    getItemsAsync(params: IEntityItemsParams, options: any = undefined): Promise<Entity[] | any[]> {
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
        let {q, values} = this.processFilters(params);
        query += q;
        query += this.processGroup(params.group);
        let res = this.processHaving(params.having);
        query += res.q + ' ';
        if(res.values.length > 0) {
            values = values.concat(res.values);
        }
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
                resolve(undefined);
            });
        });
    }

    async truncate() {
        return new Promise((resolve, reject) => {
            let q = `DELETE FROM ${this.tableEscaped}`;
            this.sql.query(q, undefined, async (err, rows) => {
                await this.invalidateAll();
                resolve(undefined);
            });
        });

    }

    getEntityClassesInvolved() {
        let classes = super.getEntityClassesInvolved();
        //@ts-ignore
        classes.push(this.entity);
        let models = {};
        this.getEntityClassesNext(classes, models);
        return classes;
    }

    getEntityClassesNext(classes, models) {
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
                const isSource = schema.source;
                const fieldId = isSource ? schema.source.id : schema.field;
                if (fieldId === 'id') {
                    continue;
                }

                const specialField = Object.values(this.specialFields).find((element) => {
                    return element.name === fieldId;
                });
                if (specialField && !specialField.isFound) {
                    continue;
                }
                p.push(new Promise(async (res, rej) => {
                    try {
                        let val = await entity[schema.field];
                        if (isSource) {
                            if (val && (schema.source.model || schema.source.callback)) {
                                val = val.id;
                            }
                        } else {
                            if (schema.type && schema.type === 'json') {
                                val = JSON.stringify(val);
                            }
                        }
                        val = await this.beforeCreate(entity, schema.field, val);
                        res({
                            field: fieldId,
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
                        globalEventModel.getEmitter().emit(EVENT_ENTITY_CREATED, {
                            entity: createdEntity,
                            source: entity
                        });
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

    protected async beforeCreate(entity: Entity, field: string, value: any) {
        if (!value) {
            if (field === this.specialFields.created.name) {
                value = Date.now() / 1000;
            }

            if (field === this.specialFields.uid.name) {
                value = await this.generateUidAsync(entity);
            }
        }
        return value;
    }


    /**
     *
     * @param entity
     * @param callback
     */
    generateUid(entity: Entity, callback) {
        let uid = uuid4();
        if (entity.uid) {
            uid = entity.uid;
        }

        this.getByUid(uid, (err, user) => {
            if (err) return callback && callback(err);
            if (user) return this.generateUid(entity, callback);
            callback && callback(undefined, uid);
        });
    }

    async generateUidAsync(entity: Entity): Promise<Entity> {
        return new Promise((resolve, reject) => {
            this.generateUid(entity, (err, uid) => {
                if (err) return reject(err);
                resolve(uid);
            });
        });
    }

    findFieldSchema(id: string): IEntitySQLMakeScheme {
        let schemas = this.schemas;
        for (const schema of schemas) {
            if (schema.field === id) return schema;
        }
    }

    async updateAsync(entity: Entity): Promise<Entity> {
        let properties = await entity.getModifiedProperties();
        if (properties.length === 0) return entity;
        let names = [];
        let values = [];
        for (const property of properties) {
            const scheme = this.findFieldSchema(property);
            let name = "`" + (scheme.source ? scheme.source.id : scheme.field) + "` = ?";
            names.push(name);
            if (scheme.type === 'json') {
                values.push(JSON.stringify(entity[property]));
            } else if (scheme.source && scheme.source.model) {
                let d = await entity[property];
                if (!d && scheme.optional) {
                    values.push(null);
                    continue;
                } else if (d) {
                    values.push(d.id);
                    continue;
                }
                throw `No data found for ${property} in model`;
            } else {
                values.push(entity[property]);
            }

        }

        values.push(entity.id);

        const q = `
            UPDATE ${this.tableEscaped}
            SET ${names.join(', ')}
            WHERE id = ?
            LIMIT 1
        `;
        return new Promise((resolve, reject) => {
            this.sql.query(q, values, async (err) => {
                if (err) return reject(err);
                await this.cacheInvalidateAsync(entity.id);
                try {
                    let item = await this.getAsync(entity.id);
                    globalEventModel.getEmitter().emit(EVENT_ENTITY_UPDATED, {entity: item, source: entity});
                    resolve(item);
                } catch (err) {
                    reject(err)
                }
            });
        });
    }

    update(entity: Entity, callback) {
        (async () => {
            try {
                let item = await this.updateAsync(entity);
                callback && callback(undefined, item);
            } catch (err) {
                callback && callback(err);
            }
        })();
    }

    async updateJsonFieldAsync(entity: Entity, fieldName: string): Promise<Entity> {
        const scheme = this.findFieldSchema(fieldName);
        if (!scheme) {
            throw `Not found ${fieldName}`;
        }
        if (scheme.type !== 'json') {
            throw `Not correct type ${fieldName}`;
        }

        let values = [
            JSON.stringify(entity[fieldName]),
            entity.id,
        ];
        const field = scheme.source ? scheme.source.id : scheme.field;
        let name = "`" + field + "` = JSON_MERGE_PATCH(`" + field + "`, ?)";
        const q = `
            UPDATE ${this.tableEscaped}
            SET ${name}
            WHERE id = ?
            LIMIT 1
        `;
        return new Promise((resolve, reject) => {
            this.sql.query(q, values, async (err) => {
                if (err) return reject(err);
                await this.cacheInvalidateAsync(entity.id);
                try {
                    let item = await this.getAsync(entity.id);
                    globalEventModel.getEmitter().emit(EVENT_ENTITY_UPDATED, {entity: item, source: entity});
                    resolve(item);
                } catch (err) {
                    reject(err)
                }
            });
        });
    }

    updateJsonField(entity: Entity, fieldName: string, callback: Function) {
        (async () => {
            try {
                let item = await this.updateJsonFieldAsync(entity, fieldName);
                callback && callback(undefined, item);
            } catch (err) {
                callback && callback(err);
            }
        })();
    }
}

export default EntitySQLModel;
