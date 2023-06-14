import ICacheFactoryModelOptions from "./ICacheFactoryModelOptions";
import ICacheOptions from "./ICacheOptions";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";
interface ICacheFactoryModel {
    options: ICacheFactoryModelOptions;
    get(id: number | string, options?: ICacheOptions): Promise<Entity>;
    set(id: number | string, data: Entity, ttl: number, options?: ICacheOptions): Promise<CacheEntity>;
    invalidate(id: number | string): any;
    invalidateAll(): any;
    getPrefix(): any;
    getType(): any;
}
export default ICacheFactoryModel;
//# sourceMappingURL=ICacheFactoryModel.d.ts.map