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
        let names = [];
        let values = [];
        if (Array.isArray(where)) {
            for (let i = 0; i < where.length; i++) {
                const equal = where[i].equal ? where[i].equal : '=';
                names.push(`${this.escapeField(where[i].key)} ${equal} ?`);
                values.push(where[i].value);
            }
        } else {
            const equal = where.equal ? where.equal : '=';
            names.push(`${this.escapeField(where.key)} ${equal} ?`);
            values.push(where.value);
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
                if(filters.join.on) {
                    q += 'ON ';
                    let res = this.processWhere(filters.join.on);
                    values.push(res.values);
                    q += `${res.names.join(' AND ')} `;
                }
            }
        }

        let where = (filters && filters.where) || params.where;

        if (where) {
            q += 'WHERE ';
            let res = this.processWhere(where);
            values.push(res.values);
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
