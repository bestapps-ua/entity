import IEntityItemsFunction from "./function/IEntityItemsFunction";

interface IEntityItemsWhere {
    key?: string | IEntityItemsFunction;
    value?: string | number | any[] | IEntityItemsFunction | IEntityItemsFunction[];
    equal?: string;
    field?: string | IEntityItemsFunction | IEntityItemsFunction[];
}

export default IEntityItemsWhere;
