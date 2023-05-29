'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class EntityBestAppsSqlModel {
    constructor(options) {
        this._table = 'PLEASE SET IN MODEL table';
        this._entity = 'PLEASE SET IN MODEL table';
        this.options = Object.assign({}, options);
    }
    get entity() {
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    get table() {
        return this._table;
    }
    set table(value) {
        this._table = value;
    }
    get(id, callback) {
        this.options.sql.getOne('SELECT * ' +
            'FROM ' + this.table + ' ' +
            'WHERE id = ? ' +
            'LIMIT 1', id, (err, row) => {
            if (err || !row) {
                return callback && callback(err);
            }
            //console.log('[row]', row);
            this.make(row, (err, itemData) => {
                callback && callback(undefined, new this._entity(itemData));
            });
        });
    }
    make(data, callback) {
        let itemData = {
            id: data.id,
            created: data.created,
        };
        callback && callback(undefined, itemData);
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
    getOneByParams(params, callback) {
        let names = [];
        let values = [];
        for (let i = 0; i < params.length; i++) {
            names.push('`' + params[i].key + '`' + ' = ?');
            values.push(params[i].value);
        }
        let q = `SELECT * FROM ${this.table} WHERE ` + names.join(' AND ') + ' LIMIT 1';
        this.options.sql.getOne(q, values, (err, row) => {
            if (err || !row)
                return callback && callback(err);
            this.get(row.id, callback);
        });
    }
    getAllByParams(params, callback) {
        let names = [];
        let values = [];
        for (let i = 0; i < params.length; i++) {
            names.push('`' + params[i].key + '`' + ' = ?');
            values.push(params[i].value);
        }
        this.options.sql.query(`SELECT * FROM ${this.table} WHERE ` + names.join(' AND ') + ' ORDER BY id ASC', values, (err, rows) => {
            this.makeList(err, rows, callback);
        });
    }
    getItemsWhere(filters) {
        let where = ['bbb'];
        let values = [];
        let leftJoin = [];
        return { where, values, leftJoin };
    }
    getItems(filters, page, limit, sort, callback) {
        //TODO: remove when send ID
        sort = sort || { field: '`' + this.table + '`.id', order: 'ASC' };
        let query = 'SELECT ' + this.table + '.* FROM ' + this.table + ' ';
        let filter = this.getItemsWhere(filters);
        if (filter.leftJoin.length > 0) {
            for (let i = 0; i < filter.leftJoin.length; i++) {
                query += 'LEFT JOIN ' + filter.leftJoin[i] + ' ';
            }
        }
        if (filter.where.length > 0) {
            query += 'WHERE ' + filter.where.join(' AND ') + ' ';
        }
        if (filter.leftJoin.length > 0) {
            query += 'GROUP BY ' + this.table + '.id ';
        }
        query += 'ORDER BY ' + `'` + sort.field + `'` + ' ' + sort.order + ' ';
        query += 'LIMIT ' + limit + ' OFFSET ' + (page * limit - limit);
        this.options.sql.query(query, filter.values, (err, rows) => {
            if (err || !rows || rows.length === 0) {
                return callback && callback(err, []);
            }
            let p = [];
            for (let i = 0; i < rows.length; i++) {
                p.push(new Promise((resolve, reject) => {
                    this.get(rows[i].id, (err, item) => {
                        resolve(item);
                    });
                }));
            }
            Promise.all(p).then((items) => {
                // console.log('ITEMS', items);
                callback && callback(undefined, items);
            }).catch((err) => {
                callback && callback(undefined, []);
            });
        });
    }
    getItemsCount(filters, callback) {
        let query = 'SELECT COUNT(*) cnt FROM ' + this.table + ' ';
        let filter = this.getItemsWhere(filters);
        if (filter.leftJoin.length > 0) {
            for (let i = 0; i < filter.leftJoin.length; i++) {
                query += 'LEFT JOIN ' + filter.leftJoin[i] + ' ';
            }
        }
        if (filter.where.length > 0) {
            query += 'WHERE ' + filter.where.join(' AND ') + ' ';
        }
        query += `LIMIT 1`;
        this.options.sql.getOne(query, filter.values, (err, row) => {
            //console.log("ROWS----", err, row, query);
            let cnt = 0;
            if (row)
                cnt = row.cnt;
            callback && callback(err, cnt);
        });
    }
    remove(item, callback) {
        this.options.sql.query('DELETE FROM ' + this.table + ' WHERE id = ? LIMIT 1', item.id, (err) => {
            callback && callback(err);
        });
    }
}
exports.default = EntityBestAppsSqlModel;
//# sourceMappingURL=entity_sql_model.js.map