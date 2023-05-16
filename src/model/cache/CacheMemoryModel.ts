'use strict';

import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheModel from "../../interface/cache/ICacheModel";
import ICacheEntity from "../../interface/cache/ICacheEntity";
import CacheEntity from "../../entity/CacheEntity";
import ICacheModelOptions from "../../interface/cache/ICacheModelOptions";

let storage = new Map();

class CacheMemoryModel implements ICacheModel {
    constructor(options: ICacheModelOptions) {
    }

    async fetch(id: number|string, options: ICacheOptions): Promise<CacheEntity>{
        return storage.get(id);
    }

    /**
     *
     * @param id
     * @param data
     * @param options
     */
    async set(id: number|string, data: ICacheEntity, options: ICacheOptions){
        storage.set(id, data);
    }

    async invalidateAll(){
        storage.clear();
    }

    async invalidate(id: number|string){
        storage.delete(id);
    }
}

export default CacheMemoryModel;
