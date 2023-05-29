'use strict';
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
exports.CACHE_TYPE_REDIS = exports.CACHE_TYPE_MEMORY = exports.CacheFactoryModel = void 0;
const CacheEntity_1 = __importDefault(require("../../entity/CacheEntity"));
const CacheMemoryModel_1 = __importDefault(require("./CacheMemoryModel"));
const CacheRedisModel_1 = __importDefault(require("./CacheRedisModel"));
const CACHE_TYPE_MEMORY = 'memory';
exports.CACHE_TYPE_MEMORY = CACHE_TYPE_MEMORY;
const CACHE_TYPE_REDIS = 'redis';
exports.CACHE_TYPE_REDIS = CACHE_TYPE_REDIS;
class CacheFactoryModel {
    constructor(options) {
        this.options = Object.assign({
            type: CACHE_TYPE_MEMORY,
        }, options);
        this.loadModel();
    }
    loadModel() {
        let model;
        switch (this.options.type) {
            case CACHE_TYPE_MEMORY:
                model = new CacheMemoryModel_1.default(this.options);
                break;
            case CACHE_TYPE_REDIS:
                model = new CacheRedisModel_1.default({
                    prefix: this.options.prefix,
                    connection: this.options.redis.connection,
                });
                break;
        }
        this.setModel(model);
    }
    setModel(model) {
        this.model = model;
    }
    /**
     * Get Entity from source
     * @param id
     * @param options
     */
    get(id, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.fetch(id, options);
            if (!data)
                return;
            if (data.expires === 0)
                return data.data;
            if (data.expires < Date.now() / 1000)
                return;
            return data.data;
        });
    }
    fetch(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.fetch(id, options);
        });
    }
    /**
     *
     * @param id
     * @param data
     * @param ttl
     * @param options
     */
    set(id, data, ttl = 300, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let d = new CacheEntity_1.default({
                ttl,
                expires: ttl > 0 ? Date.now() / 1000 + ttl : 0,
                data,
            });
            yield this.model.set(id, d, options);
            return d;
        });
    }
    invalidateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.invalidateAll();
        });
    }
    invalidate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.invalidate(id);
        });
    }
    getPrefix() {
        return this.options.prefix;
    }
    getType() {
        return this.options.type;
    }
}
exports.CacheFactoryModel = CacheFactoryModel;
//# sourceMappingURL=CacheFactoryModel.js.map