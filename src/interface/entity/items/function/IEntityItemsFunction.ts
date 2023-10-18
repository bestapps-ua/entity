import IEntityItemsItemType from "../IEntityItemsItemType";
import IEntityItemsFunctionField from "./IEntityItemsFunctionField";

interface IEntityItemsFunction extends IEntityItemsItemType {
    data?: string | {
        schema: string,
        field: IEntityItemsFunctionField | IEntityItemsFunctionField[];
    };
}

export default IEntityItemsFunction;
