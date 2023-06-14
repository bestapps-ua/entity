import IEntitySQLMakeErrorResponse from "./IEntitySQLMakeErrorResponse";
interface IEntitySQLMakeResponse {
    (error: {
        data: object;
        errors: IEntitySQLMakeErrorResponse[];
    }, data?: object): any;
}
export default IEntitySQLMakeResponse;
//# sourceMappingURL=IEntitySQLMakeResponse.d.ts.map