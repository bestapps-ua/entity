import IEntityModelOptions from "../IEntityModelOptions";
import IEntitySQLMakeScheme from "./IEntitySQLMakeScheme";
import IEntitySQLMakeOnAfter from "./make/IEntitySQLMakeOnAfter";

interface IEntitySQLModelOptions extends IEntityModelOptions{
    table: string;
    schemas: IEntitySQLMakeScheme[];
    make?: {
        onAfter?: IEntitySQLMakeOnAfter;
    };
}

export default IEntitySQLModelOptions;
