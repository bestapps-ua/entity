import Entity from "../../entity/Entity";
import ICacheFactoryModel from "../cache/ICacheFactoryModel";

interface IEntityModelOptions {
    cache: {
        can: boolean;
        ttl: number;
        model: ICacheFactoryModel;
    },
    entity: Entity;
}

export default IEntityModelOptions;
