import IEntityItemsWhereItem from "./IEntityItemsWhereItem";
import IEntityItemsWhereFuncFieldItem from "./IEntityItemsWhereFuncFieldItem";
interface IEntityItemsWhereFuncItem extends IEntityItemsWhereItem {
    data?: string | {
        schema: string;
        field: IEntityItemsWhereFuncFieldItem | IEntityItemsWhereFuncFieldItem[];
    };
}
export default IEntityItemsWhereFuncItem;
//# sourceMappingURL=IEntityItemsWhereFuncItem.d.ts.map