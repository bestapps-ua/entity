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
        let names = [];
        let values = [];
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                const equal = where[i].equal ? where[i].equal : '=';
                names.push(`${this.escapeField(where[i].key)} ${equal} ?`);
                values.push(where[i].value);
            }
        }
        else {
            const equal = where.equal ? where.equal : '=';
            names.push(`${this.escapeField(where.key)} ${equal} ?`);
            values.push(where.value);
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
                    q += 'JOIN ' + this.escapeField(filters.join[i].table) + ' ';
                }
            }
            else {
                q += 'JOIN ' + this.escapeField(filters.join.table) + ' ';
            }
        }
        let where = (filters && filters.where) || params.where;
        if (where) {
            q += 'WHERE ';
            let res = this.processWhere(where);
            values.push(res.values);
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
    processSort(sort) {
        let query = '';
        if (sort) {
            query += 'ORDER BY ';
            if (Array.isArray(sort)) {
                for (let i = 0; i < sort.length; i++) {
                    const srt = sort[i];
                    query += `${this.escapeField(srt.field)}' ${srt.order}`;
                    if (i + 1 < sort.length) {
                        query += ', ';
                    }
                    else {
                        query += ' ';
                    }
                }
            }
            else {
                query += `'${this.escapeField(sort.field)}' ${sort.order} `;
            }
        }
        return query;
    }
    processSelect(select) {
        let query = 'SELECT ';
        if (Array.isArray(select)) {
            for (let i = 0; i < select.length; i++) {
                const s = select[i];
                query += `${this.escapeField(s)} `;
                if (i + 1 < select.length) {
                    query += ', ';
                }
                else {
                    query += ' ';
                }
            }
        }
        else {
            query += `${this.escapeField(select)} `;
        }
        return query;
    }
}
exports.default = EntityBaseSQLModel;
//# sourceMappingURL=EntityBaseSQLModel.js.map