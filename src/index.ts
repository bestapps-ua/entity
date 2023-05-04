import EntitySQLModel from "./model/entity/EntitySQLModel";
import EntityModel from "./model/entity/EntityModel";
import Entity from "./entity/Entity";
import CacheEntity from "./entity/CacheEntity";
import ICacheEntity from "./interface/cache/ICacheEntity";
import ICacheFactoryModel from "./interface/cache/ICacheFactoryModel";
import ICacheFactoryModelOptions from "./interface/cache/ICacheFactoryModelOptions";
import ICacheModel from "./interface/cache/ICacheModel";
import ICacheModelOptions from "./interface/cache/ICacheModelOptions";
import ICacheOptions from "./interface/cache/ICacheOptions";
import {CacheFactoryModel} from "./model/cache/CacheFactoryModel";
import CacheMemoryModel from "./model/cache/CacheMemoryModel";

export default {
    entity: {
        Entity,
        CacheEntity,
    },
    model: {
        EntityModel,
        EntitySQLModel,
        cache: {
            CacheFactoryModel,
            CacheMemoryModel,
        }
    },
    interface: {
        cache: {
            ICacheEntity,
            ICacheFactoryModel,
            ICacheFactoryModelOptions,
            ICacheModel,
            ICacheModelOptions,
            ICacheOptions,
        },
        entity: {
            sql: {

            },
            items: {

            },
        }
    },
}
