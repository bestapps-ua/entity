import IEntityModelOptions from "../IEntityModelOptions";
import IEntitySQLMakeScheme from "./IEntitySQLMakeScheme";
import Entity from "../../../entity/Entity";

interface IEntitySQLModelOptions extends IEntityModelOptions{
    sql: any;
    table: string;
    make: {
        schemas: IEntitySQLMakeScheme[];
    };
}

export default IEntitySQLModelOptions;
