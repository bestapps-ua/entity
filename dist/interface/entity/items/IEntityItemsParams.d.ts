import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsSort from "./IEntityItemsSort";
import IEntityItemsWhere from "./IEntityItemsWhere";
interface IEntityItemsParams {
    select?: string | string[];
    filters?: IEntityItemsFilter;
    page?: number;
    limit?: number;
    sort?: IEntityItemsSort | IEntityItemsSort[];
    group?: string | string[];
    native?: boolean;
    where?: IEntityItemsWhere | IEntityItemsWhere[];
}
export default IEntityItemsParams;
//# sourceMappingURL=IEntityItemsParams.d.ts.map