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
Object.defineProperty(exports, "__esModule", { value: true });
const EntitySQLModel_1 = __importDefault(require("./model/entity/EntitySQLModel"));
const EntityModel_1 = __importDefault(require("./model/entity/EntityModel"));
const Entity_1 = __importDefault(require("./entity/Entity"));
const CacheEntity_1 = __importDefault(require("./entity/CacheEntity"));
const CacheFactoryModel_1 = require("./model/cache/CacheFactoryModel");
const CacheMemoryModel_1 = __importDefault(require("./model/cache/CacheMemoryModel"));
const EntityCacheModel_1 = __importDefault(require("./model/entity/EntityCacheModel"));
const CacheRedisModel_1 = __importDefault(require("./model/cache/CacheRedisModel"));
const Events = __importStar(require("events"));
const GlobalEventModel_1 = __importDefault(require("./model/event/GlobalEventModel"));
const ConfigModel_1 = __importDefault(require("./model/ConfigModel"));
const RegistryModel_1 = __importDefault(require("./model/RegistryModel"));
const List_1 = __importDefault(require("./entity/List"));
exports.default = {
    entity: {
        Entity: Entity_1.default,
        List: List_1.default,
        CacheEntity: CacheEntity_1.default,
    },
    model: {
        configModel: ConfigModel_1.default,
        RegistryModel: RegistryModel_1.default,
        entity: {
            EntityModel: EntityModel_1.default,
            EntityCacheModel: EntityCacheModel_1.default,
            EntitySQLModel: EntitySQLModel_1.default,
        },
        cache: {
            CacheFactoryModel: CacheFactoryModel_1.CacheFactoryModel,
            CacheMemoryModel: CacheMemoryModel_1.default,
            CacheRedisModel: CacheRedisModel_1.default,
        },
        event: {
            Events,
            globalEventModel: GlobalEventModel_1.default,
        },
    },
};
//# sourceMappingURL=index.js.map