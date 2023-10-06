import EntityModel from "./EntityModel";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsFilter from "../../interface/entity/items/IEntityItemsFilter";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import EntityCacheModel from "./EntityCacheModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";

class EntityBaseSQLModel extends EntityCacheModel {
    protected escapeField(field: string) {
        function esc(key: string): string {
            if (key.includes('*')) return key;
            if (key.includes('`')) return key;
            return '`' + key + '`';
        }

        let f = field.split('.');

        for (let i = 0; i < f.length; i++) {
            f[i] = esc(f[i]);
        }
        return f.join('.');
    }

    protected processWhere(where: IEntityItemsWhere | IEntityItemsWhere[]) {
        function prepareValue(me, where: IEntityItemsWhere, sign: string){
            let s = sign;
            if (typeof where.value !== 'object' || Array.isArray(where.value)) {
                values.push(where.value);
            } else {
                let res = prepareObj(me, where.value);
                s = ` ${res.data}`;
                if (res.values.length > 0) {
                    values = values.concat(res.values);
                }
            }
            return s;
        }

        function prepareKey(me, where: IEntityItemsWhere){
            let res = prepareObj(me, where.key);
            let key = `${res.data}`;
            if (res.values.length > 0) {
                values = values.concat(res.values);
            }
            return key;
        }

        function prepare(me, where: IEntityItemsWhere) {
            let equal = where.equal ? where.equal : '=';
            const sign = equal.toLowerCase() === 'in' ? '(?)' : '?';
            if (where.value || where.value === null) {
                if (
                    where.value === null ||
                    where.value.toString().toLowerCase() === 'null' ||
                    where.value.toString().toLowerCase() === 'not null'
                ) {
                    equal = where.equal ? equal : 'IS';
                    let name = `${equal} ${where.value}`;
                    if(typeof where.key === 'object'){
                        let key = prepareKey(me, where);
                        name = `${key} ${name}`;
                    }else{
                        name = `${me.escapeField(where.key)} ${name}`
                    }
                    names.push(name);
                } else if (typeof where.key !== 'object') {
                    let signChanged = prepareValue(me, where, sign);
                    let name = `${me.escapeField(where.key)} ${equal} ${signChanged}`;
                    names.push(name);
                } else {
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
                if(typeof where.key === 'object'){
                    name = `${prepareKey(me, where)} ${name}`;
                }else{
                    name = `${me.escapeField(where.key)} ${name}`;
                }
                names.push(name);
            }
        }

        function prepareObj(me, data: any) {
            let vals = [];
            if (typeof data === 'string') {
                return {
                    data,
                    values: vals,
                };
            }
            if (data.type === 'function') {
                return prepareFunc(me, data.data);
            }
            throw `not found type ${data.type}`;
        }

        function prepareFunc(me, funcData: any) {
            let func = '';
            let vals = [];

            func = funcData.schema;
            let fields = Array.isArray(funcData.field) ? funcData.field : [funcData.field];
            for (const field of fields) {
                if (field.key) {
                    func = func.replace(new RegExp(`\:${field.key.schema}`, 'g'), me.escapeField(field.key.value));
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

        let names = [];
        let values = [];
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                prepare(this, where[i]);
            }
        } else {
            prepare(this, where);
        }
        return {
            names,
            values,
        };
    }

    protected processFilters(params: IEntityItemsParams) {
        let q = '';
        let values = [];
        let filters = params.filters;
        if (filters && filters.join) {
            if (Array.isArray(filters.join)) {
                for (let i = 0; i < filters.join.length; i++) {
                    let j = filters.join[i].type || 'JOIN';
                    q += `${j}` + this.escapeField(filters.join[i].table) + ' ';
                }
            } else {
                let j = filters.join.type || 'JOIN';
                q += `${j} ` + this.escapeField(filters.join.table) + ' ';
                if (filters.join.on) {
                    q += 'ON ';
                    let res = this.processWhere(filters.join.on);
                    if (res.values.length > 0) {
                        values.push(res.values);
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
        return {q, values};
    }

    protected processGroup(group: string | string[]) {
        let q = '';
        if (group) {
            q += 'GROUP BY ';
            if (Array.isArray(group)) {
                for (let i = 0; i < group.length; i++) {
                    const grp = group[i];
                    q += `${this.escapeField(grp)} `;
                    if (i + 1 < group.length) {
                        q += ', ';
                    } else {
                        q += ' ';
                    }
                }
            } else {
                q += `${this.escapeField(group)} `;
            }
        }
        return q;
    }

    protected processSort(sort: IEntityItemsSort | IEntityItemsSort[]) {
        let query = '';
        if (sort) {
            query += 'ORDER BY ';
            if (Array.isArray(sort)) {
                for (let i = 0; i < sort.length; i++) {
                    const srt = sort[i];
                    query += `${this.escapeField(srt.field)} ${srt.order}`;
                    if (i + 1 < sort.length) {
                        query += ', ';
                    } else {
                        query += ' ';
                    }
                }
            } else {
                query += `${this.escapeField(sort.field)} ${sort.order} `;
            }
        }
        return query;
    }

    protected processSelect(select: string | string[]) {
        let query = 'SELECT ';
        if (Array.isArray(select)) {
            for (let i = 0; i < select.length; i++) {
                const s = select[i];
                query += `${this.escapeField(s)} `;
                if (i + 1 < select.length) {
                    query += ', ';
                } else {
                    query += ' ';
                }
            }
        } else {
            query += `${this.escapeField(select)} `;
        }
        return query;
    }
}

export default EntityBaseSQLModel;
