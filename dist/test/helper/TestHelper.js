"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testHelper = exports.TestHelper = void 0;
const SQLModel_1 = __importDefault(require("../model/SQLModel"));
class TestHelper {
    constructor() {
        this.beforeAll();
        this.afterAll();
    }
    prepare() {
    }
    beforeAll(callback = undefined) {
        beforeAll(done => {
            if (callback) {
                callback(done);
            }
            else {
                done();
            }
        });
    }
    afterAll(callback = undefined) {
        afterAll(done => {
            SQLModel_1.default.connectionEnd(() => {
                if (callback) {
                    callback(done);
                }
                else {
                    done();
                }
            });
        });
    }
}
exports.TestHelper = TestHelper;
let testHelper = new TestHelper();
exports.testHelper = testHelper;
//# sourceMappingURL=TestHelper.js.map