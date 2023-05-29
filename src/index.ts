import EntitySQLModel from "./model/entity/EntitySQLModel";
import EntityModel from "./model/entity/EntityModel";
import Entity from "./entity/Entity";
import CacheEntity from "./entity/CacheEntity";
import {CacheFactoryModel} from "./model/cache/CacheFactoryModel";
import CacheMemoryModel from "./model/cache/CacheMemoryModel";
import EntityCacheModel from "./model/entity/EntityCacheModel";
import CacheRedisModel from "./model/cache/CacheRedisModel";
import * as Events from "events";
import globalEventModel from "./model/event/GlobalEventModel";
import configModel from "./model/ConfigModel";
import RegistryModel from "./model/RegistryModel";

export default {
    entity: {
        Entity,
        CacheEntity,
    },
    model: {
        configModel,
        RegistryModel,
        entity: {
            EntityModel,
            EntityCacheModel,
            EntitySQLModel,
        },
        cache: {
            CacheFactoryModel,
            CacheMemoryModel,
            CacheRedisModel,
        },
        event: {
            Events,
            globalEventModel,
        },
    },
}
