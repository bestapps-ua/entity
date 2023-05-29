'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntityBaseSQLModel_1 = __importDefault(require("./EntityBaseSQLModel"));
const GlobalEventModel_1 = __importDefault(require("../event/GlobalEventModel"));
const Events_1 = require("../event/Events");
const RegistryModel_1 = __importDefault(require("../RegistryModel"));
let uuid4 = require('uuid/v4');
class EntitySQLModel extends EntityBaseSQLModel_1.default {
    constructor(options) {
        super(options);
        this.table = options.table;
        this.options.schemas = this.options.schemas || [];
        this._fillDefault();
    }
    _fillDefault() {
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
    get table() {
        if (!this._table)
            throw 'Please init options.table';
        return this._table;
    }
    get tableEscaped() {
        let table = this.table;
        return this.escapeField(table);
    }
    set table(value) {
        this._table = value;
    }
    get sql() {
        if (!this._sql) {
            this._sql = RegistryModel_1.default.get('sql');
            if (!this._sql) {
                throw 'Please set in Registry - sql';
            }
        }
        return this._sql;
    }
    set sql(value) {
        this._sql = value;
    }
    get schemas() {
        let schemas = this.options.schemas;
        if (!schemas)
            throw 'Please init options.schemas';
        return schemas;
    }
    get(id, callback) {
        this.cacheGet(id, (err, item) => {
            if (item) {
                return callback && callback(undefined, item);
            }
            this.sql.getOne('SELECT * ' +
                'FROM ' + this.tableEscaped + ' ' +
                'WHERE id = ? ' +
                'LIMIT 1', id, (err, row) => {
                if (err || !row) {
                    return callback && callback(err);
                }
                this.make(row, (err, itemData) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return callback && callback(err);
                    //@ts-ignore
                    let entity = new this._entity(itemData);
                    yield this.cacheSetAsync(id, entity);
                    callback && callback(undefined, entity);
                }));
            });
        });
    }
    getAsync(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.get(id, (err, item) => {
                    if (err)
                        return reject(err);
                    resolve(item);
                });
            });
        });
    }
    make(data, callback) {
        if (!data) {
            return callback && callback({ data, errors: [{ error: `no data provided in ${this.constructor.name}.make` }] });
        }
        let t1 = Date.now();
        let itemData = {
            id: data.id,
            uid: data.uid,
            system: {
                isCache: false,
                ttl: 0,
            },
            created: data.created,
        };
        let p = [];
        let errors = [];
        let schemas = this.schemas;
        for (const schema of schemas) {
            p.push(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let item = undefined;
                let source = schema.source ? schema.source : {
                    id: schema.field,
                };
                const entityId = source.id;
                if (source.model) {
                    if (schema.source.model === 'this') {
                        schema.source.model = this;
                    }
                    const model = schema.source.model;
                    if (schema.optional && !data[entityId]) {
                        return resolve(item);
                    }
                    try {
                        if (schema.isLazy) {
                            item = (() => {
                                return function lazy() {
                                    return (() => __awaiter(this, void 0, void 0, function* () {
                                        try {
                                            return yield model.getAsync(data[entityId]);
                                        }
                                        catch (e) {
                                            console.log('[error lazy load]', entityId, e);
                                        }
                                    }));
                                };
                            })();
                        }
                        else {
                            item = yield model.getAsync(data[entityId]);
                        }
                    }
                    catch (e) {
                        errors.push({
                            field: schema.field,
                            sourceId: entityId,
                            error: e,
                        });
                    }
                }
                else {
                    item = data[entityId];
                }
                if (schema.type && schema.type === 'json') {
                    item = item ? JSON.parse(item) : {};
                }
                itemData[schema.field] = item;
                resolve(item);
            })));
        }
        Promise.all(p).then(() => {
            itemData.system.ttl = Date.now() - t1;
            callback && callback(errors.length > 0 ? { data, errors } : undefined, itemData);
        }).catch((err) => {
            itemData.system.ttl = Date.now() - t1;
            callback && callback({ data, errors: [{ error: err }] }, itemData);
        });
    }
    getByUid(uid, callback) {
        this.getOneByParams([{ key: 'uid', value: uid }], callback);
    }
    getByUidAsync(uid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getByUid(uid, (err, item) => {
                    if (err)
                        return reject(err);
                    resolve(item);
                });
            });
        });
    }
    /**
     * @param data
     */
    makeAsync(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.make(data, (err, item) => {
                    if (err)
                        return reject(err);
                    resolve(item);
                });
            });
        });
    }
    makeList(err, rows, callback) {
        if (err) {
            return callback && callback(err, []);
        }
        if (!rows || rows.length === 0)
            return callback && callback(undefined, []);
        let p = [];
        for (let i = 0; i < rows.length; i++) {
            p.push(new Promise((resolve, reject) => {
                this.get(rows[i].id, (err, item) => {
                    if (!item)
                        return reject(err);
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
    makeListAsync(err, rows) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.makeList(err, rows, (err, items) => {
                    if (err)
                        return reject(err);
                    resolve(items);
                });
            });
        });
    }
    makeListOnly(err, rows, callback) {
        if (err) {
            return callback && callback(err, []);
        }
        if (!rows || rows.length === 0)
            return callback && callback(undefined, []);
        let p = [];
        for (let i = 0; i < rows.length; i++) {
            p.push(new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let row = rows[i];
                try {
                    let itemData = yield this.makeAsync(row);
                    //@ts-ignore
                    let entity = new this._entity(itemData);
                    resolve(entity);
                }
                catch (e) {
                    reject(e);
                }
            })));
        }
        Promise.all(p).then((items) => {
            callback && callback(undefined, items);
        }).catch((err) => {
            callback && callback(err, []);
        });
    }
    makeListOnlyAsync(err, rows) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.makeListOnly(err, rows, (err, items) => {
                    if (err)
                        return reject(err);
                    resolve(items);
                });
            });
        });
    }
    getOneByParams(params, callback) {
        let { names, values } = this.processWhere(params);
        let q = `
            SELECT *
            FROM ${this.tableEscaped}
            WHERE ` + names.join(' AND ') + ' LIMIT 1';
        this.sql.getOne(q, values, (err, row) => {
            if (err || !row)
                return callback && callback(err);
            this.get(row.id, callback);
        });
    }
    getOneByParamsAsync(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getOneByParams(params, (err, item) => {
                    if (err)
                        return reject(err);
                    resolve(item);
                });
            });
        });
    }
    getAllByParams(params, callback) {
        let { names, values } = this.processWhere(params);
        let q = `
            SELECT *
            FROM ${this.tableEscaped}
            WHERE ${names.join(' AND ')}
            ORDER BY id ASC`;
        this.sql.query(q, values, (err, rows) => {
            this.makeList(err, rows, callback);
        });
    }
    getAllByParamsAsync(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getAllByParams(params, (err, items) => {
                    resolve(items);
                });
            });
        });
    }
    /**
     * @param params
     * @param callback
     */
    getItems(params, callback) {
        params.sort = params.sort || { field: this.escapeField(this.table + '.id'), order: 'ASC' };
        params.select = params.select || `${this.tableEscaped}.*`;
        let query = this.processSelect(params.select) + ' ';
        query += `FROM ${this.tableEscaped} `;
        let { q, values } = this.processFilters(params);
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
    getItemsAsync(params, options = undefined) {
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
    getItemsCount(params, callback) {
        let query = `
            SELECT COUNT(*) cnt
            FROM ${this.tableEscaped}
        `;
        let { q, values } = this.processFilters(params);
        query += q;
        query += this.processGroup(params.group);
        query += `LIMIT 1`;
        this.sql.getOne(query, values, (err, row) => {
            let cnt = 0;
            if (row)
                cnt = row.cnt;
            callback && callback(err, cnt);
        });
    }
    getItemsCountAsync(params) {
        return new Promise((resolve, reject) => {
            this.getItemsCount(params, (err, item) => {
                resolve(item);
            });
        });
    }
    remove(item, callback) {
        let q = `
            DELETE
            FROM ${this.tableEscaped}
            WHERE id = ? LIMIT 1
        `;
        this.sql.query(q, item.id, (err) => __awaiter(this, void 0, void 0, function* () {
            yield this.cacheInvalidateAsync(item.id);
            callback && callback(err);
        }));
    }
    removeAsync(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.remove(item, (err) => {
                    if (err)
                        return reject(err);
                    resolve();
                });
            });
        });
    }
    truncate() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let q = `TRUNCATE ${this.tableEscaped}`;
                this.sql.query(q, undefined, () => __awaiter(this, void 0, void 0, function* () {
                    yield this.invalidateAll();
                    resolve();
                }));
            });
        });
    }
    getEntityClassesInvolved() {
        let classes = super.getEntityClassesInvolved();
        classes.push(this.entity);
        let models = {};
        this.getEntityClassesNext(classes, models);
        return classes;
    }
    getEntityClassesNext(classes, models) {
        let schemas = this.schemas;
        for (const schema of schemas) {
            if (!schema.source)
                continue;
            let source = schema.source;
            if (!source.model)
                continue;
            if (source.model === 'this')
                continue;
            let model = source.model.constructor.name;
            if (models[model])
                continue;
            models[model] = true;
            let m = source.model;
            classes.push(m.entity);
            m.getEntityClassesNext(classes, models);
        }
    }
    createAsync(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let p = [];
                for (const schema of this.schemas) {
                    if (schema.field === 'id')
                        continue;
                    p.push(new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            let val = yield entity[schema.field];
                            const isSource = schema.source;
                            if (isSource) {
                                if (val) {
                                    val = val.id;
                                }
                            }
                            else {
                                if (schema.type && schema.type === 'json') {
                                    val = JSON.stringify(val);
                                }
                            }
                            val = yield this.beforeCreate(schema.field, val);
                            res({
                                field: isSource ? schema.source.id : schema.field,
                                value: val,
                            });
                        }
                        catch (err) {
                            rej(err);
                        }
                    })));
                }
                Promise.all(p).then((items) => {
                    let ins = {};
                    for (const item of items) {
                        ins[item.field] = item.value;
                    }
                    this.sql.insertQueryAll(this.table, [ins], (err, id) => __awaiter(this, void 0, void 0, function* () {
                        if (err || !id) {
                            err = err || 'no id provided';
                            console.log('[err create insert]', err, entity);
                            return reject(err);
                        }
                        try {
                            let createdEntity = yield this.getAsync(id);
                            if (!createdEntity) {
                                throw 'not found';
                            }
                            GlobalEventModel_1.default.getEmitter().emit(Events_1.EVENT_ENTITY_CREATED, {
                                entity: createdEntity,
                                source: entity
                            });
                            resolve(createdEntity);
                        }
                        catch (err) {
                            console.log('[err create get]', err, id, entity);
                            reject(err);
                        }
                    }));
                }).catch((err) => {
                    console.log('[err create]', err, entity);
                    resolve(err);
                });
            });
        });
    }
    create(entity, callback) {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.createAsync(entity);
                callback && callback(undefined, res);
            }
            catch (err) {
                callback && callback(err);
            }
        }))();
    }
    beforeCreate(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!value) {
                if (field === 'created') {
                    value = Date.now() / 1000;
                }
                if (field === 'uid') {
                    value = yield this.generateUidAsync();
                }
            }
            return value;
        });
    }
    /**
     *
     * @param callback
     */
    generateUid(callback) {
        let uid = uuid4();
        this.getByUid(uid, (err, user) => {
            if (err)
                return callback && callback(err);
            if (user)
                return this.generateUid(callback);
            callback && callback(undefined, uid);
        });
    }
    generateUidAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.generateUid((err, uid) => {
                    if (err)
                        return reject(err);
                    resolve(uid);
                });
            });
        });
    }
    findFieldSchema(id) {
        let schemas = this.schemas;
        for (const schema of schemas) {
            if (schema.field === id)
                return schema;
        }
    }
    updateAsync(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let properties = yield entity.getModifiedProperties();
            if (properties.length === 0)
                return entity;
            let names = [];
            let values = [];
            for (const property of properties) {
                const scheme = this.findFieldSchema(property);
                let name = "`" + (scheme.source ? scheme.source.id : scheme.field) + "` = ?";
                names.push(name);
                if (scheme.type === 'json') {
                    values.push(JSON.stringify(entity[property]));
                }
                else if (scheme.source && scheme.source.model) {
                    let d = yield entity[property];
                    if (!d && scheme.optional) {
                        values.push(null);
                        continue;
                    }
                    else if (d) {
                        values.push(d.id);
                        continue;
                    }
                    throw `No data found for ${property} in model`;
                }
                else {
                    values.push(entity[property]);
                }
            }
            values.push(entity.id);
            const q = `
            UPDATE ${this.tableEscaped}
            SET ${names.join(', ')}
            WHERE id = ? LIMIT 1
        `;
            return new Promise((resolve, reject) => {
                this.sql.query(q, values, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return reject(err);
                    yield this.cacheInvalidateAsync(entity.id);
                    try {
                        let item = yield this.getAsync(entity.id);
                        GlobalEventModel_1.default.getEmitter().emit(Events_1.EVENT_ENTITY_UPDATED, { entity: item, source: entity });
                        resolve(item);
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            });
        });
    }
    update(entity, callback) {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                let item = yield this.updateAsync(entity);
                callback && callback(undefined, item);
            }
            catch (err) {
                callback && callback(err);
            }
        }))();
    }
    updateJsonFieldAsync(entity, fieldName) {
        return __awaiter(this, void 0, void 0, function* () {
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
            WHERE id = ? LIMIT 1
        `;
            return new Promise((resolve, reject) => {
                this.sql.query(q, values, (err) => __awaiter(this, void 0, void 0, function* () {
                    if (err)
                        return reject(err);
                    yield this.cacheInvalidateAsync(entity.id);
                    try {
                        let item = yield this.getAsync(entity.id);
                        GlobalEventModel_1.default.getEmitter().emit(Events_1.EVENT_ENTITY_UPDATED, { entity: item, source: entity });
                        resolve(item);
                    }
                    catch (err) {
                        reject(err);
                    }
                }));
            });
        });
    }
    updateJsonField(entity, fieldName, callback) {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                let item = yield this.updateJsonFieldAsync(entity, fieldName);
                callback && callback(undefined, item);
            }
            catch (err) {
                callback && callback(err);
            }
        }))();
    }
}
exports.default = EntitySQLModel;
//# sourceMappingURL=EntitySQLModel.js.map