import {CACHE_TYPE_MEMORY, CacheFactoryModel} from "../../src/model/cache/CacheFactoryModel";
import configModel from "../../src/model/ConfigModel";
import RegistryModel from "../../src/model/RegistryModel";
let config = require('config');

class CacheHelper {
    constructor() {
        configModel.setCacheConfig(config.cache);
        RegistryModel.set('configModel', configModel);
    }

    getFactory(type: string) {
        let cfg = JSON.parse(JSON.stringify(configModel.getCacheConfig()));
        cfg.type = type;
        return new CacheFactoryModel(cfg);
    }

}

export default new CacheHelper();
