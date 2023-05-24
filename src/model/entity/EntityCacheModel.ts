import EntityModel from "./EntityModel";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsFilter from "../../interface/entity/items/IEntityItemsFilter";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";
import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import {CACHE_TYPE_MEMORY, CacheFactoryModel} from "../cache/CacheFactoryModel";
import ICacheFactoryModel from "../../interface/cache/ICacheFactoryModel";
import configModel from "../ConfigModel";


class EntityCacheModel extends EntityModel {

    protected classesInvolved: any[];
    private entityClassname: string;

    constructor(options: IEntityModelOptions) {
        const cacheConfig = configModel.getCacheConfig();
        //TODO: check models from config by table name (can and ttl)
        options = Object.assign({
            cache: {
                can: {
                    store: false,
                    fetch: false,
                },
                ttl: 0,
                model: new CacheFactoryModel(cacheConfig),
            },
        }, options);
        super(options);
        this.classesInvolved = this.getEntityClassesInvolved();
        // @ts-ignore
        this.entityClassname = (new this._entity({})).getClassName();
    }

    protected canStore(): boolean {
        return this.options.cache.can.store;
    }

    protected canFetch(): boolean {
        return this.options.cache.can.fetch;
    }

    private getCacheId(id: string | number): string {
        return `${this.options.cache.model.getPrefix()}::${this.entityClassname}::${id}`;
    }

    cacheGet(id: string | number, callback) {
        (async () => {
            try {
                let t1 = Date.now();
                let data = await this.cacheGetAsync(id);
                if(data) {
                    data.system = {
                        ttl: Date.now() - t1,
                        isCache: true,
                    };
                }
                callback && callback(undefined, data);
            } catch (err) {
                callback && callback(err);
            }
        })();
    }

    async cacheGetAsync(id: string | number): Promise<Entity> {
        if (!this.canFetch()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.get(cacheId, {classes: this.classesInvolved});
    }

    async cacheSetAsync(id: string | number, data: Entity): Promise<CacheEntity> {
        if (!this.canStore()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.set(cacheId, data, this.options.cache.ttl);
    }

    async cacheInvalidateAsync(id: string | number) {
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.invalidate(cacheId);
    }

    async invalidateAll(){
        return await this.options.cache.model.invalidateAll();
    }

    async getCachedMaybe(id, callback: Function = undefined) {
        return new Promise(async (resolve, reject) => {
            let key = this.getCacheId(id);
            let cache = await this.options.cache.model.get(key);
            if (cache) {
                resolve(cache);
                return callback && callback(undefined, cache);
            }
            resolve(await this.get(id, callback));
        });
    }

    getEntityClassesInvolved(){
        return [Entity, CacheEntity];
    }

    async serialize(data: Entity){

    }

    async unserialize(data: string){

    }

    setCacheTtl(ttl: number){
        this.options.cache.ttl = ttl;
    }

    private setCacheCan(key: string, can: boolean){
        this.options.cache.can[key] = can;
    }

    setCacheCanStore(can: boolean){
        this.setCacheCan('store', can);
    }

    setCacheCanFetch(can: boolean){
        this.setCacheCan('fetch', can);
    }

    setCacheModel(model: ICacheFactoryModel){
        this.options.cache.model = model;
    }
}

export default EntityCacheModel;
