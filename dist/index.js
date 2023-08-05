"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const CacheEntity_1 = __importDefault(require("./entity/CacheEntity"));
const Entity_1 = __importDefault(require("./entity/Entity"));
const List_1 = __importDefault(require("./entity/List"));
const AppModel_1 = __importDefault(require("./model/AppModel"));
const RegistryModel_1 = __importDefault(require("./model/RegistryModel"));
const ConfigModel_1 = __importDefault(require("./model/ConfigModel"));
const CacheBaseModel_1 = __importDefault(require("./model/cache/CacheBaseModel"));
const cfm = __importStar(require("./model/cache/CacheFactoryModel"));
const CacheMemoryModel_1 = __importDefault(require("./model/cache/CacheMemoryModel"));
const CacheRedisModel_1 = __importDefault(require("./model/cache/CacheRedisModel"));
const EntityModel_1 = __importDefault(require("./model/entity/EntityModel"));
const EntitySQLModel_1 = __importDefault(require("./model/entity/EntitySQLModel"));
const EntityBaseSQLModel_1 = __importDefault(require("./model/entity/EntityBaseSQLModel"));
const EntityCacheModel_1 = __importDefault(require("./model/entity/EntityCacheModel"));
const events = __importStar(require("./model/event/Events"));
const GlobalEventModel_1 = __importDefault(require("./model/event/GlobalEventModel"));
var BestApps;
(function (BestApps) {
    let entities;
    (function (entities) {
        class CacheEntity extends CacheEntity_1.default {
        }
        entities.CacheEntity = CacheEntity;
        class Entity extends Entity_1.default {
        }
        entities.Entity = Entity;
        class List extends List_1.default {
        }
        entities.List = List;
    })(entities = BestApps.entities || (BestApps.entities = {}));
    let models;
    (function (models) {
        function getAppModel() {
            return AppModel_1.default;
        }
        models.getAppModel = getAppModel;
        function getRegistryModel() {
            return RegistryModel_1.default;
        }
        models.getRegistryModel = getRegistryModel;
        function getConfigModel() {
            return ConfigModel_1.default;
        }
        models.getConfigModel = getConfigModel;
        function getGlobalEventModel() {
            return GlobalEventModel_1.default;
        }
        models.getGlobalEventModel = getGlobalEventModel;
        function getEvents() {
            return events;
        }
        models.getEvents = getEvents;
        class CacheBaseModel extends CacheBaseModel_1.default {
        }
        models.CacheBaseModel = CacheBaseModel;
        class CacheMemoryModel extends CacheMemoryModel_1.default {
        }
        models.CacheMemoryModel = CacheMemoryModel;
        class CacheRedisModel extends CacheRedisModel_1.default {
        }
        models.CacheRedisModel = CacheRedisModel;
        class EntityModel extends EntityModel_1.default {
        }
        models.EntityModel = EntityModel;
        class EntitySQLModel extends EntitySQLModel_1.default {
        }
        models.EntitySQLModel = EntitySQLModel;
        class EntityBaseSQLModel extends EntityBaseSQLModel_1.default {
        }
        models.EntityBaseSQLModel = EntityBaseSQLModel;
        class EntityCacheModel extends EntityCacheModel_1.default {
        }
        models.EntityCacheModel = EntityCacheModel;
        class CacheFactoryModel extends cfm.CacheFactoryModel {
        }
        models.CacheFactoryModel = CacheFactoryModel;
    })(models = BestApps.models || (BestApps.models = {}));
})(BestApps || (BestApps = {}));
module.exports = BestApps;
//# sourceMappingURL=index.js.map