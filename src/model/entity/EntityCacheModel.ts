import EntityModel from "./EntityModel";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsFilter from "../../interface/entity/items/IEntityItemsFilter";
import IEntityItemsSort from "../../interface/entity/items/IEntityItemsSort";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";
import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";

class EntityCacheModel extends EntityModel {

    constructor(options: IEntityModelOptions) {
        options = Object.assign({
            cache: {
                can: {
                    store: false,
                    fetch: false,
                },
                ttl: 0,
            }
        }, options);
        super(options);
    }

    protected canStore(): boolean {
        return this.options.cache.can.store;
    }

    protected canFetch(): boolean {
        return this.options.cache.can.fetch;
    }

    private getCacheId(id: string | number): string {
        return `${this._entity.getClassName()}::${id}`;
    }

    cacheGet(id: string | number, callback) {
        (async () => {
            try {
                let data = await this.cacheGetAsync(id);
                callback && callback(undefined, data);
            } catch (err) {
                callback && callback(err);
            }
        })();
    }

    async cacheGetAsync(id: string | number): Promise<Entity> {
        if (!this.canFetch()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.get(cacheId);
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
}

export default EntityCacheModel;
