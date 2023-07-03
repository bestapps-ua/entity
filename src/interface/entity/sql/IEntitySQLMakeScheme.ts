import IEntitySQLModel from "./IEntitySQLModel";
import Entity from "../../../entity/Entity";

interface IEntitySchemeCallback {
    callback(err: any, entity: Entity);
}

interface IEntitySQLMakeScheme {
    field: string;
    type?: string;
    source?: {
        id: string;
        model?: IEntitySQLModel|string;
        callback?: (id: number| string, IEntitySchemeCallback) => void;
    };
    isLazy?: boolean;
    optional?: boolean;
}

export default IEntitySQLMakeScheme;
