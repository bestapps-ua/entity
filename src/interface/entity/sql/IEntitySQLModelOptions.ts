import IEntityModelOptions from "../IEntityModelOptions";
import IEntitySQLMakeScheme from "./IEntitySQLMakeScheme";

interface IEntitySQLModelOptions extends IEntityModelOptions{
    sql: any;
    table: string;
    make: {
        schemas: IEntitySQLMakeScheme[];
    };
}

export default IEntitySQLModelOptions;
