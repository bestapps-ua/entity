"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntityModel_1 = __importDefault(require("./EntityModel"));
const Entity_1 = __importDefault(require("../../entity/Entity"));
const CacheEntity_1 = __importDefault(require("../../entity/CacheEntity"));
const CacheFactoryModel_1 = require("../cache/CacheFactoryModel");
const RegistryModel_1 = __importDefault(require("../RegistryModel"));
class EntityCacheModel extends EntityModel_1.default {
    constructor(options) {
        super(options);
        this.classesInvolved = this.getEntityClassesInvolved();
        // @ts-ignore
        this.entityClassname = (new this._entity({})).getClassName();
    }
    get cache() {
        if (this.options.cache)
            return this.options.cache;
        const configModel = RegistryModel_1.default.get('configModel');
        let defaultModel = {
            can: {
                store: false,
                fetch: false,
            },
            ttl: 0,
            model: undefined,
        };
        if (!configModel)
            return defaultModel;
        const cacheConfig = configModel.getCacheConfig();
        let model = this.entityClassname;
        let modelConfig = this.findCacheModelConfig(model, cacheConfig.models);
        modelConfig = modelConfig || defaultModel;
        modelConfig.model = new CacheFactoryModel_1.CacheFactoryModel(cacheConfig);
        this.options.cache = modelConfig;
        return this.options.cache;
    }
    canStore() {
        return this.cache.can.store;
    }
    canFetch() {
        return this.cache.can.fetch;
    }
    getCacheId(id) {
        if (!this.cache.model)
            return;
        return `${this.cache.model.getPrefix()}::${this.entityClassname}::${id}`;
    }
    cacheGet(id, callback) {
        (() => __awaiter(this, void 0, void 0, function* () {
            try {
                let t1 = Date.now();
                let data = yield this.cacheGetAsync(id);
                if (data) {
                    data.system = {
                        ttl: Date.now() - t1,
                        isCache: true,
                        type: this.cache.model.getType(),
                    };
                }
                callback && callback(undefined, data);
            }
            catch (err) {
                callback && callback(err);
            }
        }))();
    }
    cacheGetAsync(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canFetch())
                return;
            let cacheId = this.getCacheId(id);
            return yield this.cache.model.get(cacheId, { classes: this.classesInvolved });
        });
    }
    cacheSetAsync(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.canStore())
                return;
            let cacheId = this.getCacheId(id);
            return yield this.cache.model.set(cacheId, data, this.cache.ttl);
        });
    }
    cacheInvalidateAsync(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cache.model)
                return;
            let cacheId = this.getCacheId(id);
            return yield this.cache.model.invalidate(cacheId);
        });
    }
    invalidateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cache.model) {
                return yield this.cache.model.invalidateAll();
            }
        });
    }
    getCachedMaybe(id, callback = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                let key = this.getCacheId(id);
                let cache = yield this.cache.model.get(key);
                if (cache) {
                    resolve(cache);
                    return callback && callback(undefined, cache);
                }
                resolve(yield this.get(id, callback));
            }));
        });
    }
    getEntityClassesInvolved() {
        return [Entity_1.default, CacheEntity_1.default];
    }
    setCacheTtl(ttl) {
        this.cache.ttl = ttl;
    }
    setCacheCan(key, can) {
        this.cache.can[key] = can;
    }
    setCacheCanStore(can) {
        this.setCacheCan('store', can);
    }
    setCacheCanFetch(can) {
        this.setCacheCan('fetch', can);
    }
    setCacheModel(model) {
        this.cache.model = model;
    }
    findCacheModelConfig(name, models) {
        for (const model of models) {
            if (model.name === name) {
                return JSON.parse(JSON.stringify(model));
            }
        }
    }
}
exports.default = EntityCacheModel;
//# sourceMappingURL=EntityCacheModel.js.map