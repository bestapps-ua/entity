import IEntitySQLMakeErrorResponse from "./IEntitySQLMakeErrorResponse";
import Entity from "../../../../entity/Entity";

interface IEntitySQLMakeListResponse {
    (error: {
        data: object;
        errors: IEntitySQLMakeErrorResponse[];
    }, data: Entity[]);
}

export default IEntitySQLMakeListResponse;
