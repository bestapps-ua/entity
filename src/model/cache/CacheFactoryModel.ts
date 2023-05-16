'use strict';

import Entity from "../../entity/Entity";
import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheFactoryModelOptions from "../../interface/cache/ICacheFactoryModelOptions";
import ICacheModel from "../../interface/cache/ICacheModel";
import CacheEntity from "../../entity/CacheEntity";
import CacheMemoryModel from "./CacheMemoryModel";
import ICacheFactoryModel from "../../interface/cache/ICacheFactoryModel";

const CACHE_TYPE_MEMORY = 'memory';

class CacheFactoryModel implements ICacheFactoryModel {
    private model: ICacheModel;
    public options: ICacheFactoryModelOptions;

    constructor(options: ICacheFactoryModelOptions = {}) {
        this.options = Object.assign({
            type: CACHE_TYPE_MEMORY
        }, options);

        this.loadModel();
    }

    private loadModel() {
        let model;
        switch(this.options.type){
            case CACHE_TYPE_MEMORY:
                model = new CacheMemoryModel(this.options.options);
                break;
        }
        this.setModel(model);
    }

    setModel(model: ICacheModel) {
        this.model = model;
    }

    /**
     * Get Entity from source
     * @param id
     * @param options
     */
    async get(id: number | string, options: ICacheOptions = {}): Promise<Entity> {
        let data = await this.fetch(id, options);
        if (!data) return ;
        if(data.expires === 0) return data.data;
        if(data.expires < Date.now() / 1000) return ;
        return data.data;
    }

    private async fetch(id: number | string, options: ICacheOptions): Promise<CacheEntity> {
        return await this.model.fetch(id, options);
    }

    /**
     *
     * @param id
     * @param data
     * @param ttl
     * @param options
     */
    async set(id: number | string, data: Entity, ttl: number = 300, options: ICacheOptions = {}): Promise<CacheEntity> {
        let d = new CacheEntity({
            ttl,
            expires: ttl > 0 ? Date.now() / 1000 + ttl: 0,
            data,
        });
        await this.model.set(id, d, options);
        return d;
    }

    async invalidateAll() {
        return await this.model.invalidateAll();
    }

    async invalidate(id: number | string) {
        return await this.model.invalidate(id);
    }
}

export {
    CacheFactoryModel,
    CACHE_TYPE_MEMORY,
};
