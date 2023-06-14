import Entity from "../../entity/Entity";
import ICacheFactoryModel from "../cache/ICacheFactoryModel";
interface IEntityModelOptions {
    cache?: {
        can: {
            store: boolean;
            fetch: boolean;
        };
        ttl: number;
        model: ICacheFactoryModel;
    };
    entity: Entity;
}
export default IEntityModelOptions;
//# sourceMappingURL=IEntityModelOptions.d.ts.map