"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntityCacheModel_1 = __importDefault(require("./EntityCacheModel"));
class EntityBaseSQLModel extends EntityCacheModel_1.default {
    escapeField(field) {
        function esc(key) {
            if (key.includes('*'))
                return key;
            if (key.includes('`'))
                return key;
            return '`' + key + '`';
        }
        let f = field.split('.');
        for (let i = 0; i < f.length; i++) {
            f[i] = esc(f[i]);
        }
        return f.join('.');
    }
    processWhere(where) {
        function prepareValue(me, where, sign) {
            let s = sign;
            if (typeof where.value !== 'object' || Array.isArray(where.value)) {
                values.push(where.value);
            }
            else {
                let res = prepareObj(me, where.value);
                s = ` ${res.data}`;
                if (res.values.length > 0) {
                    values = values.concat(res.values);
                }
            }
            return s;
        }
        function prepareKey(me, where) {
            let res = prepareObj(me, where.key);
            let key = `${res.data}`;
            if (res.values.length > 0) {
                values = values.concat(res.values);
            }
            return key;
        }
        function prepare(me, where) {
            let equal = where.equal ? where.equal : '=';
            const sign = equal.toLowerCase() === 'in' ? '(?)' : '?';
            if (where.value || where.value === null) {
                if (where.value === null ||
                    where.value.toString().toLowerCase() === 'null' ||
                    where.value.toString().toLowerCase() === 'not null') {
                    equal = where.equal ? equal : 'IS';
                    let name = `${equal} ${where.value}`;
                    if (typeof where.key === 'object') {
                        let key = prepareKey(me, where);
                        name = `${key} ${name}`;
                    }
                    else {
                        name = `${me.escapeField(where.key)} ${name}`;
                    }
                    names.push(name);
                }
                else if (typeof where.key !== 'object') {
                    let signChanged = prepareValue(me, where, sign);
                    let name = `${me.escapeField(where.key)} ${equal} ${signChanged}`;
                    names.push(name);
                }
                else {
                    let name = `${equal}`;
                    name = `${prepareKey(me, where)} ${name}`;
                    //values.push(where.value);
                    let signChanged = prepareValue(me, where, sign);
                    name = `${name} ${signChanged}`;
                    names.push(name);
                }
            }
            if (where.field) {
                let name = `${equal} ${me.escapeField(where.field)}`;
                if (typeof where.key === 'object') {
                    name = `${prepareKey(me, where)} ${name}`;
                }
                else {
                    name = `${me.escapeField(where.key)} ${name}`;
                }
                names.push(name);
            }
        }
        function prepareObj(me, data) {
            let vals = [];
            if (typeof data === 'string') {
                return {
                    data,
                    values: vals,
                };
            }
            if (data.type === 'function') {
                return me.processFunction(data);
            }
            throw `not found type ${data.type}`;
        }
        let names = [];
        let values = [];
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                prepare(this, where[i]);
            }
        }
        else {
            prepare(this, where);
        }
        return {
            names,
            values,
        };
    }
    processFilters(params) {
        let q = '';
        let values = [];
        let filters = params.filters;
        if (filters && filters.join) {
            if (Array.isArray(filters.join)) {
                for (let i = 0; i < filters.join.length; i++) {
                    let j = filters.join[i].type || 'JOIN';
                    q += `${j}` + this.escapeField(filters.join[i].table) + ' ';
                }
            }
            else {
                let j = filters.join.type || 'JOIN';
                q += `${j} ` + this.escapeField(filters.join.table) + ' ';
                if (filters.join.on) {
                    q += 'ON ';
                    let res = this.processWhere(filters.join.on);
                    if (res.values.length > 0) {
                        values = values.concat(res.values);
                    }
                    q += `${res.names.join(' AND ')} `;
                }
            }
        }
        let where = (filters && filters.where) || params.where;
        if (where) {
            q += 'WHERE ';
            let res = this.processWhere(where);
            values = values.concat(res.values);
            q += `${res.names.join(' AND ')} `;
        }
        return { q, values };
    }
    processGroup(group) {
        let q = '';
        if (group) {
            q += 'GROUP BY ';
            if (Array.isArray(group)) {
                for (let i = 0; i < group.length; i++) {
                    const grp = group[i];
                    q += `${this.escapeField(grp)} `;
                    if (i + 1 < group.length) {
                        q += ', ';
                    }
                    else {
                        q += ' ';
                    }
                }
            }
            else {
                q += `${this.escapeField(group)} `;
            }
        }
        return q;
    }
    processFunction(funcData) {
        let func = '';
        let vals = [];
        let data = funcData.data;
        if (typeof data === 'string') {
            return {
                data,
                values: vals,
            };
        }
        func = data.schema;
        let fields = Array.isArray(data.field) ? data.field : [data.field];
        for (const field of fields) {
            if (field.key) {
                func = func.replace(new RegExp(`\:${field.key.schema}`, 'g'), this.escapeField(field.key.value));
            }
            if (field.value) {
                func = func.replace(new RegExp(`\:${field.value.schema}`, 'g'), '?');
                vals.push(field.value.value);
            }
        }
        return {
            data: func,
            values: vals,
        };
    }
    processSort(sort) {
        let values = [];
        function make(me, sort) {
            for (let i = 0; i < sort.length; i++) {
                const srt = sort[i];
                if (typeof srt.field === 'string') {
                    query += `${me.escapeField(srt.field)} ${srt.order}`;
                    if (i + 1 < sort.length) {
                        query += ', ';
                    }
                    else {
                        query += ' ';
                    }
                }
                else {
                    let fields = Array.isArray(srt.field) ? srt.field : [srt.field];
                    for (let j = 0; j < fields.length; j++) {
                        const field = fields[j];
                        if (field.type === 'function') {
                            let res = me.processFunction(field);
                            query += `${res.data} ${srt.order}`;
                            if (i + 1 < sort.length) {
                                query += ', ';
                            }
                            else {
                                query += ' ';
                            }
                            if (res.values.length > 0) {
                                values = values.concat(res.values);
                            }
                        }
                    }
                }
            }
        }
        let query = '';
        if (sort) {
            query += 'ORDER BY ';
            if (!Array.isArray(sort)) {
                sort = [sort];
            }
            make(this, sort);
        }
        return {
            query,
            values,
        };
    }
    /**
     * Example: 'SELECT *, HMM, IF(true, lol, hmm), zzz ' or Array of string|IEntityItemsFunction;
     * TODO: parse functions in string - so make this as magick!!!
     * @param table
     * @param select
     * @protected
     */
    processSelect(table, select) {
        let values = [];
        let query = 'SELECT ';
        if (typeof select === 'string') {
            let sel = [`${table}.*`];
            if (select.indexOf('select') === 0) {
                select = select.substring(7).trim();
            }
            if (select.indexOf('*') === 0) {
                select = select.substring(1).trim();
            }
            select = select.trim();
            let bracket = 0;
            let from = 0;
            let len = 0;
            for (let i = 0; i < select.length; i++) {
                if (select[i] === '(') {
                    bracket++;
                }
                if (select[i] === ')') {
                    bracket--;
                }
                if (select[i] === ',' && bracket === 0) {
                    sel.push(select.substring(from, len).trim());
                    from = i;
                    len = 0;
                }
                len++;
            }
            for (let i = 0; i < sel.length; i++) {
                const s = sel[i];
                query += `${this.escapeField(s)}`;
                if (i + 1 < sel.length) {
                    query += ', ';
                }
                else {
                    query += ' ';
                }
            }
        }
        else {
            if (!Array.isArray(select)) {
                select = [select];
            }
            for (let i = 0; i < select.length; i++) {
                const s = select[i];
                let isAll = false;
                if (s === '*') {
                    query += `${table}.*`;
                    isAll = true;
                }
                if (i === 0 && !isAll &&
                    ((typeof s === 'string' && !s.includes('*')) ||
                        typeof s !== 'string')) {
                    query += `${table}.*, `;
                }
                if (!isAll) {
                    if (typeof s === 'string') {
                        query += `${this.escapeField(s)}`;
                    }
                    else {
                        if (s.type === 'function') {
                            let res = this.processFunction(s);
                            query += res.data;
                            if (res.values.length > 0) {
                                values = values.concat(res.values);
                            }
                        }
                    }
                }
                if (i + 1 < select.length) {
                    query += ', ';
                }
                else {
                    query += ' ';
                }
            }
        }
        return {
            query,
            values,
        };
    }
}
exports.default = EntityBaseSQLModel;
//# sourceMappingURL=EntityBaseSQLModel.js.map