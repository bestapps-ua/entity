import IEntityItemsWhereFuncItem from "./IEntityItemsWhereFuncItem";

interface IEntityItemsWhere {
    key?: string | IEntityItemsWhereFuncItem;
    value?: string | number | any[] | IEntityItemsWhereFuncItem | IEntityItemsWhereFuncItem[];
    equal?: string;
    field?: string | IEntityItemsWhereFuncItem | IEntityItemsWhereFuncItem[];
}

export default IEntityItemsWhere;
