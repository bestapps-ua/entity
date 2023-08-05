import EntityModel from "./EntityModel";

import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";
import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import {CacheFactoryModel} from "../cache/CacheFactoryModel";
import ICacheFactoryModel from "../../interface/cache/ICacheFactoryModel";
import RegistryModel from "../RegistryModel";
import IEntityCacheOptions from "../../interface/entity/IEntityCacheOptions";

class EntityCacheModel extends EntityModel {

    protected classesInvolved: any[];
    private entityClassname: string;

    constructor(options: IEntityModelOptions) {
        super(options);
        this.classesInvolved = this.getEntityClassesInvolved();
        // @ts-ignore
        this.entityClassname = (new this._entity({})).getClassName();
    }

    get cache() {
        if (this.options.cache) return this.options.cache;
        const configModel = RegistryModel.get('configModel');
        let defaultModel = {
            can: {
                store: false,
                fetch: false,
            },
            ttl: 0,
            model: undefined,
        };
        if(!configModel) return defaultModel;
        const cacheConfig = configModel.getCacheConfig();
        let model = this.entityClassname;
        let modelConfig = this.findCacheModelConfig(model, cacheConfig.models);
        modelConfig = modelConfig || defaultModel;
        modelConfig.model = new CacheFactoryModel(cacheConfig);

        this.options.cache = modelConfig;
        return this.options.cache;
    }

    protected canStore(): boolean {
        return this.cache.can.store;
    }

    protected canFetch(): boolean {
        return this.cache.can.fetch;
    }

    private getCacheId(id: string | number): string {
        if(!this.cache.model) return ;
        return `${this.cache.model.getPrefix()}::${this.entityClassname}::${id}`;
    }

    cacheGet(id: string | number, callback) {
        (async () => {
            try {
                let t1 = Date.now();
                let data = await this.cacheGetAsync(id);
                if (data) {
                    data.system = {
                        ttl: Date.now() - t1,
                        isCache: true,
                        type: this.cache.model.getType(),
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
        return await this.cache.model.get(cacheId, {classes: this.classesInvolved});
    }

    async cacheSetAsync(id: string | number, data: Entity): Promise<CacheEntity> {
        if (!this.canStore()) return;
        let cacheId = this.getCacheId(id);
        return await this.cache.model.set(cacheId, data, this.cache.ttl);
    }

    async cacheInvalidateAsync(id: string | number) {
        if(!this.cache.model) return ;
        let cacheId = this.getCacheId(id);
        return await this.cache.model.invalidate(cacheId);
    }

    async invalidateAll() {
        return await this.cache.model.invalidateAll();
    }

    async getCachedMaybe(id, callback: Function = undefined) {
        return new Promise(async (resolve, reject) => {
            let key = this.getCacheId(id);
            let cache = await this.cache.model.get(key);
            if (cache) {
                resolve(cache);
                return callback && callback(undefined, cache);
            }
            resolve(await this.get(id, callback));
        });
    }

    getEntityClassesInvolved() {
        return [Entity, CacheEntity];
    }

    setCacheTtl(ttl: number) {
        this.cache.ttl = ttl;
    }

    private setCacheCan(key: string, can: boolean) {
        this.cache.can[key] = can;
    }

    setCacheCanStore(can: boolean) {
        this.setCacheCan('store', can);
    }

    setCacheCanFetch(can: boolean) {
        this.setCacheCan('fetch', can);
    }

    setCacheModel(model: ICacheFactoryModel) {
        this.cache.model = model;
    }

    private findCacheModelConfig(name: string, models: any[]): IEntityCacheOptions {
        for (const model of models) {
            if(model.name === name) {
                return JSON.parse(JSON.stringify(model));
            }
        }
    }
}

export default EntityCacheModel;
