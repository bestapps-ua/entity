import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsSort from "./IEntityItemsSort";
import IEntityItemsWhere from "./IEntityItemsWhere";
import IEntityItemsFunction from "./function/IEntityItemsFunction";
interface IEntityItemsParams {
    select?: string | IEntityItemsFunction | ((string | IEntityItemsFunction)[]);
    filters?: IEntityItemsFilter;
    page?: number;
    limit?: number;
    sort?: string | IEntityItemsSort | IEntityItemsSort[];
    group?: string | string[];
    native?: boolean;
    where?: IEntityItemsWhere | IEntityItemsWhere[];
    having?: IEntityItemsWhere | IEntityItemsWhere[];
}
export default IEntityItemsParams;
//# sourceMappingURL=IEntityItemsParams.d.ts.map