import IEntitySQLModel from "./IEntitySQLModel";

interface IEntitySQLMakeScheme {
    field: string;
    source: {
        id: string;
        model?: IEntitySQLModel|string;
        isLazy?: boolean;
        optional?: boolean;
    };
}

export default IEntitySQLMakeScheme;
