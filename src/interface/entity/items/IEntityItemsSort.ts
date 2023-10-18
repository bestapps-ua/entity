import IEntityItemsFunction from "./function/IEntityItemsFunction";

interface IEntityItemsSort {
    field: string | IEntityItemsFunction | IEntityItemsFunction[];
    order: string;
}

export default IEntityItemsSort;
