import IEntitySQLMakeErrorResponse from "./IEntitySQLMakeErrorResponse";

interface IEntitySQLMakeResponse {
    (error: {
        data: object;
        errors: IEntitySQLMakeErrorResponse[];
    }, data?: object);
}

export default IEntitySQLMakeResponse;
