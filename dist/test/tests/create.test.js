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
const MainModel_1 = __importDefault(require("../model/MainModel"));
const TestHelper_1 = require("../helper/TestHelper");
const MainEntityHelper_1 = __importDefault(require("../helper/MainEntityHelper"));
const GlobalEventModel_1 = __importDefault(require("../../src/model/event/GlobalEventModel"));
const Events_1 = require("../../src/model/event/Events");
describe('Create', () => {
    it('Main', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        const entity = yield MainEntityHelper_1.default.generate();
        let data = yield MainModel_1.default.createAsync(entity);
        yield MainEntityHelper_1.default.checkAllData(entity.props, data);
    }));
    it('Main with Parent', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        const entity = yield MainEntityHelper_1.default.generate({ withParent: true });
        let data = yield MainModel_1.default.createAsync(entity);
        yield MainEntityHelper_1.default.checkAllData(entity.props, data, { withParent: true });
    }));
    it('Event', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        let can = true;
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            GlobalEventModel_1.default.getEmitter().on(Events_1.EVENT_ENTITY_CREATED, (data) => __awaiter(void 0, void 0, void 0, function* () {
                if (!can)
                    return;
                can = false;
                yield MainEntityHelper_1.default.checkAllData(data.entity.props, data.entity);
                resolve();
            }));
            yield MainEntityHelper_1.default.create();
        }));
    }));
});
//# sourceMappingURL=create.test.js.map