import IEntityModelOptions from "../IEntityModelOptions";
import IEntitySQLMakeScheme from "./IEntitySQLMakeScheme";
import Entity from "../../../entity/Entity";

interface IEntitySQLModelOptions extends IEntityModelOptions{
    table: string;
    schemas: IEntitySQLMakeScheme[];
}

export default IEntitySQLModelOptions;
