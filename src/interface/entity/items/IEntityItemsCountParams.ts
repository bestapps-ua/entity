import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsSort from "./IEntityItemsSort";

interface IEntityItemsCountParams {
    filters?: IEntityItemsFilter;
    group?: string | string[];
}

export default IEntityItemsCountParams;
