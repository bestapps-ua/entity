import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import EntityCacheModel from "./EntityCacheModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";
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
    protected processSort(sort: IEntityItemsSort | IEntityItemsSort[]): string;
    protected processSelect(select: string | string[]): string;
}
export default EntityBaseSQLModel;
//# sourceMappingURL=EntityBaseSQLModel.d.ts.map