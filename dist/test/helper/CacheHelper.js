"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CacheFactoryModel_1 = require("../../src/model/cache/CacheFactoryModel");
const ConfigModel_1 = __importDefault(require("../../src/model/ConfigModel"));
const RegistryModel_1 = __importDefault(require("../../src/model/RegistryModel"));
let config = require('config');
class CacheHelper {
    constructor() {
        ConfigModel_1.default.setCacheConfig(config.cache);
        RegistryModel_1.default.set('configModel', ConfigModel_1.default);
    }
    getFactory(type) {
        let cfg = JSON.parse(JSON.stringify(ConfigModel_1.default.getCacheConfig()));
        cfg.type = type;
        return new CacheFactoryModel_1.CacheFactoryModel(cfg);
    }
}
exports.default = new CacheHelper();
//# sourceMappingURL=CacheHelper.js.map