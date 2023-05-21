import {CACHE_TYPE_MEMORY, CacheFactoryModel} from "../../src/model/cache/CacheFactoryModel";
import configModel from "../../src/model/ConfigModel";
let config = require('config');

class CacheHelper {
    constructor() {
        configModel.setCacheConfig(config.cache);
    }

    getFactory(type: string) {
        let cfg = JSON.parse(JSON.stringify(configModel.getCacheConfig()));
        cfg.type = type;
        return new CacheFactoryModel(cfg);
    }

}

export default new CacheHelper();
