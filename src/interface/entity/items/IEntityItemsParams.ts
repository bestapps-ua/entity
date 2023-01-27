import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsSort from "./IEntityItemsSort";

interface IEntityItemsParams {
    select: string|string[];
    filters?: IEntityItemsFilter;
    page?: number;
    limit?: number;
    sort?: IEntityItemsSort | IEntityItemsSort[];
    group?: string | string[];
    native: boolean;
}

export default IEntityItemsParams;
