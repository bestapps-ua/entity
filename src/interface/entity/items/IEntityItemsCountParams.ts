import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsSort from "./IEntityItemsSort";
import IEntityItemsWhere from "./IEntityItemsWhere";

interface IEntityItemsCountParams {
    filters?: IEntityItemsFilter;
    group?: string | string[];
    having?: IEntityItemsWhere|IEntityItemsWhere[];
}

export default IEntityItemsCountParams;
