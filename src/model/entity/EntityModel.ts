import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";

class EntityModel {
    protected options: IEntityModelOptions;
    protected _entity: Entity;

    constructor(options: IEntityModelOptions) {
        this.options = Object.assign({
            cache: {
                can: false,
                ttl: 0,
            }
        }, options);
        this.entity = options.entity;
    }

    get entity() {
        if (!this._entity) throw 'Please set entity in options';
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }

    protected canCache(): boolean {
        return this.options.cache.can;
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
        if (!this.canCache()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.get(cacheId);
    }

    async cacheSetAsync(id: string | number, data: Entity): Promise<CacheEntity> {
        if (!this.canCache()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.set(cacheId, data, this.options.cache.ttl);
    }

    async cacheInvalidateAsync(id: string | number) {
        if (!this.canCache()) return;
        let cacheId = this.getCacheId(id);
        return await this.options.cache.model.invalidate(cacheId);
    }
}

export default EntityModel;
