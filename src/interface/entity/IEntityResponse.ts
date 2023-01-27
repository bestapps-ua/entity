import Entity from "../../entity/Entity";

interface IEntityResponse {
    (err: string|any, item?: Entity): void;
}

export default IEntityResponse;
