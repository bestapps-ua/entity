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
const TestRedisHelper_1 = require("../../helper/TestRedisHelper");
const MainEntityHelper_1 = __importDefault(require("../../helper/MainEntityHelper"));
const MainModel_1 = __importDefault(require("../../model/MainModel"));
const CacheFactoryModel_1 = require("../../../src/model/cache/CacheFactoryModel");
const CacheHelper_1 = __importDefault(require("../../helper/CacheHelper"));
describe('Cache', () => {
    it('Main', () => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            TestRedisHelper_1.testRedisHelper.prepare();
            const entity = yield MainEntityHelper_1.default.generate();
            MainModel_1.default.setCacheModel(CacheHelper_1.default.getFactory(CacheFactoryModel_1.CACHE_TYPE_REDIS));
            MainModel_1.default.setCacheTtl(1);
            MainModel_1.default.setCacheCanFetch(true);
            MainModel_1.default.setCacheCanStore(true);
            let mainEntity = yield MainModel_1.default.createAsync(entity);
            expect(mainEntity.system.isCache).toBe(false);
            mainEntity = (yield MainModel_1.default.getAsync(mainEntity.id));
            expect(mainEntity.system.isCache).toBe(true);
            expect(mainEntity.system.type === CacheFactoryModel_1.CACHE_TYPE_REDIS).toBe(true);
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                mainEntity = (yield MainModel_1.default.getAsync(mainEntity.id));
                expect(mainEntity.system.isCache).toBe(false);
                resolve();
            }), 1001);
        }));
    }));
});
//# sourceMappingURL=cache.redis.test.js.map