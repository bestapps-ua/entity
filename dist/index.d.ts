/// <reference types="node" />
import EntitySQLModel from "./model/entity/EntitySQLModel";
import EntityModel from "./model/entity/EntityModel";
import Entity from "./entity/Entity";
import CacheEntity from "./entity/CacheEntity";
import { CacheFactoryModel } from "./model/cache/CacheFactoryModel";
import CacheMemoryModel from "./model/cache/CacheMemoryModel";
import EntityCacheModel from "./model/entity/EntityCacheModel";
import CacheRedisModel from "./model/cache/CacheRedisModel";
import * as Events from "events";
import RegistryModel from "./model/RegistryModel";
import List from "./entity/List";
declare const _default: {
    entity: {
        Entity: typeof Entity;
        List: typeof List;
        CacheEntity: typeof CacheEntity;
    };
    model: {
        configModel: {
            cacheConfig: import("./interface/config/IConfigCache").default;
            setCacheConfig(cfg: import("./interface/config/IConfigCache").default): void;
            getCacheConfig(): import("./interface/config/IConfigCache").default;
        };
        RegistryModel: typeof RegistryModel;
        entity: {
            EntityModel: typeof EntityModel;
            EntityCacheModel: typeof EntityCacheModel;
            EntitySQLModel: typeof EntitySQLModel;
        };
        cache: {
            CacheFactoryModel: typeof CacheFactoryModel;
            CacheMemoryModel: typeof CacheMemoryModel;
            CacheRedisModel: typeof CacheRedisModel;
        };
        event: {
            Events: typeof Events;
            globalEventModel: {
                getEmitter(): any;
            };
        };
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map