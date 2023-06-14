import IEntitySQLMakeErrorResponse from "./IEntitySQLMakeErrorResponse";
import Entity from "../../../../entity/Entity";
interface IEntitySQLMakeListResponse {
    (error: {
        data: object;
        errors: IEntitySQLMakeErrorResponse[];
    }, data: Entity[]): any;
}
export default IEntitySQLMakeListResponse;
//# sourceMappingURL=IEntitySQLMakeListResponse.d.ts.map