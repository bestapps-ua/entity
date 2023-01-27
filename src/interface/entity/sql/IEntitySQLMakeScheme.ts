import IEntitySQLModel from "./IEntitySQLModel";

interface IEntitySQLMakeScheme {
    field: string;
    source: {
        id: string;
        model?: IEntitySQLModel;
    };
}

export default IEntitySQLMakeScheme;
