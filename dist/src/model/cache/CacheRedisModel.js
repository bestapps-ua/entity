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
const redis_1 = require("redis");
const CacheBaseModel_1 = __importDefault(require("./CacheBaseModel"));
const RegistryModel_1 = __importDefault(require("../RegistryModel"));
class CacheRedisModel extends CacheBaseModel_1.default {
    constructor(options) {
        super(options);
    }
    get client() {
        this._client = RegistryModel_1.default.get('redisClient');
        if (!this._client) {
            this.initRedisClient();
        }
        return this._client;
    }
    initRedisClient() {
        let url = `redis://`;
        if (this.options.connection.username) {
            url += `${this.options.connection.username}:${this.options.connection.password}@`;
        }
        if (this.options.connection.host) {
            url += `${this.options.connection.host}`;
        }
        else {
            url += `localhost`;
        }
        if (this.options.connection.port) {
            url += `:${this.options.connection.port}`;
        }
        else {
            url += `:6379`;
        }
        this._client = (0, redis_1.createClient)({
            url,
        });
        this._client.connect();
        RegistryModel_1.default.set('redisClient', this._client);
    }
    fetch(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.client.get(id);
            try {
                const decoded = this.decode(data, options);
                return decoded;
            }
            catch (e) {
                console.log('error redis decode', e, data);
            }
        });
    }
    /**
     *
     * @param id
     * @param data
     * @param options
     */
    set(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const serialized = this.encode(data, options);
            yield this.client.set(id, serialized, {
                EX: data.ttl,
            });
        });
    }
    invalidateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let p = [];
            const keys = yield this.client.sendCommand(["keys", `${this.options.prefix}::*`]);
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i];
                p.push(new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
                    yield this.invalidate(key);
                    res();
                })));
            }
            yield Promise.all(p);
        });
    }
    invalidate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.sendCommand(['DEL', id]);
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.disconnect();
        });
    }
}
exports.default = CacheRedisModel;
//# sourceMappingURL=CacheRedisModel.js.map