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
exports.testRedisHelper = exports.TestRedisHelper = void 0;
const TestHelper_1 = require("./TestHelper");
const RegistryModel_1 = __importDefault(require("../../src/model/RegistryModel"));
class TestRedisHelper extends TestHelper_1.TestHelper {
    afterAll(callback = undefined) {
        let cb = (done) => __awaiter(this, void 0, void 0, function* () {
            let redisClient = RegistryModel_1.default.get('redisClient');
            if (redisClient) {
                yield redisClient.disconnect();
            }
            done();
        });
        super.afterAll(cb);
    }
}
exports.TestRedisHelper = TestRedisHelper;
let testRedisHelper = new TestRedisHelper();
exports.testRedisHelper = testRedisHelper;
//# sourceMappingURL=TestRedisHelper.js.map