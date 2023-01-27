import Entity from "../../entity/Entity";

interface ICacheEntity {
    ttl: number;
    expires: number;
    created: number;
    data: Entity;
}

export default ICacheEntity;
