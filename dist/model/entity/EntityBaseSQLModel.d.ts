import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import EntityCacheModel from "./EntityCacheModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";
import IEntityItemsFunction from "../../interface/entity/items/function/IEntityItemsFunction";
declare class EntityBaseSQLModel extends EntityCacheModel {
    protected escapeField(field: string): string;
    protected processWhere(where: IEntityItemsWhere | IEntityItemsWhere[]): {
        names: any[];
        values: any[];
    };
    protected processFilters(params: IEntityItemsParams): {
        q: string;
        values: any[];
    };
    protected processGroup(group: string | string[]): string;
    protected processFunction(funcData: IEntityItemsFunction): {
        data: string;
        values: any[];
    };
    protected processSort(sort: IEntityItemsSort | IEntityItemsSort[]): {
        query: string;
        values: any[];
    };
    /**
     * Example: 'SELECT *, HMM, IF(true, lol, hmm), zzz ' or Array of string|IEntityItemsFunction;
     * TODO: parse functions in string - so make this as magick!!!
     * @param table
     * @param select
     * @protected
     */
    protected processSelect(table: string, select: string | IEntityItemsFunction | ((string | IEntityItemsFunction)[])): {
        query: string;
        values: any[];
    };
}
export default EntityBaseSQLModel;
//# sourceMappingURL=EntityBaseSQLModel.d.ts.map