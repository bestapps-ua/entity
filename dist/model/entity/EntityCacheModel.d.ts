import EntityModel from "./EntityModel";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";
import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import ICacheFactoryModel from "../../interface/cache/ICacheFactoryModel";
declare class EntityCacheModel extends EntityModel {
    protected classesInvolved: any[];
    private entityClassname;
    constructor(options: IEntityModelOptions);
    get cache(): {
        can: {
            store: boolean;
            fetch: boolean;
        };
        ttl: number;
        model: any;
    };
    protected canStore(): boolean;
    protected canFetch(): boolean;
    private getCacheId;
    cacheGet(id: string | number, callback: any): void;
    cacheGetAsync(id: string | number): Promise<Entity>;
    cacheSetAsync(id: string | number, data: Entity): Promise<CacheEntity>;
    cacheInvalidateAsync(id: string | number): Promise<any>;
    invalidateAll(): Promise<any>;
    getCachedMaybe(id: any, callback?: Function): Promise<unknown>;
    getEntityClassesInvolved(): (typeof Entity | typeof CacheEntity)[];
    setCacheTtl(ttl: number): void;
    private setCacheCan;
    setCacheCanStore(can: boolean): void;
    setCacheCanFetch(can: boolean): void;
    setCacheModel(model: ICacheFactoryModel): void;
    private findCacheModelConfig;
}
export default EntityCacheModel;
//# sourceMappingURL=EntityCacheModel.d.ts.map