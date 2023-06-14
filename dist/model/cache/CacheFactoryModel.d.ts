import Entity from "../../entity/Entity";
import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheFactoryModelOptions from "../../interface/cache/ICacheFactoryModelOptions";
import ICacheModel from "../../interface/cache/ICacheModel";
import CacheEntity from "../../entity/CacheEntity";
import ICacheFactoryModel from "../../interface/cache/ICacheFactoryModel";
declare const CACHE_TYPE_MEMORY = "memory";
declare const CACHE_TYPE_REDIS = "redis";
declare class CacheFactoryModel implements ICacheFactoryModel {
    private model;
    options: ICacheFactoryModelOptions;
    constructor(options: ICacheFactoryModelOptions);
    private loadModel;
    setModel(model: ICacheModel): void;
    /**
     * Get Entity from source
     * @param id
     * @param options
     */
    get(id: number | string, options?: ICacheOptions): Promise<Entity>;
    private fetch;
    /**
     *
     * @param id
     * @param data
     * @param ttl
     * @param options
     */
    set(id: number | string, data: Entity, ttl?: number, options?: ICacheOptions): Promise<CacheEntity>;
    invalidateAll(): Promise<any>;
    invalidate(id: number | string): Promise<any>;
    getPrefix(): string;
    getType(): string;
}
export { CacheFactoryModel, CACHE_TYPE_MEMORY, CACHE_TYPE_REDIS, };
//# sourceMappingURL=CacheFactoryModel.d.ts.map