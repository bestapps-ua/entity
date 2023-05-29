"use strict";
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
exports.default = {
    entity: {
        Entity: Entity_1.default,
        CacheEntity: CacheEntity_1.default,
    },
    model: {
        EntityModel: EntityModel_1.default,
        EntitySQLModel: EntitySQLModel_1.default,
        cache: {
            CacheFactoryModel: CacheFactoryModel_1.CacheFactoryModel,
            CacheMemoryModel: CacheMemoryModel_1.default,
        }
    },
};
//# sourceMappingURL=index.js.map