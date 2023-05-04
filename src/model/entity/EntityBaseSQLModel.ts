import EntityModel from "./EntityModel";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsFilter from "../../interface/entity/items/IEntityItemsFilter";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import EntityCacheModel from "./EntityCacheModel";

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
                names.push(`${this.escapeField(where[i].key)} = ?`);
                values.push(where[i].value);
            }
        } else {
            names.push(`${this.escapeField(where.key)} = ?`);
            values.push(where.value);
        }
        return {
            names,
            values,
        };
    }

    protected processFilter(filter: IEntityItemsFilter) {
        let q = '';
        let values = [];
        if (filter.join) {
            if (Array.isArray(filter.join)) {
                for (let i = 0; i < filter.join.length; i++) {
                    q += 'JOIN ' + this.escapeField(filter.join[i].table) + ' ';
                }
            } else {
                q += 'JOIN ' + this.escapeField(filter.join.table) + ' ';
            }
        }

        if (filter.where) {
            q += 'WHERE ';
            let res = this.processWhere(filter.where);
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
                    query += `${this.escapeField(srt.field)}' ${srt.order}`;
                    if (i + 1 < sort.length) {
                        query += ', ';
                    } else {
                        query += ' ';
                    }
                }
            } else {
                query += `'${this.escapeField(sort.field)}' ${sort.order} `;
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
