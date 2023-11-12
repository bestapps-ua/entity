import IEntityItemsFilter from "./IEntityItemsFilter";
import IEntityItemsWhere from "./IEntityItemsWhere";
interface IEntityItemsCountParams {
    filters?: IEntityItemsFilter;
    group?: string | string[];
    having?: IEntityItemsWhere | IEntityItemsWhere[];
}
export default IEntityItemsCountParams;
//# sourceMappingURL=IEntityItemsCountParams.d.ts.map