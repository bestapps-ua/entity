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
const MainEntityHelper_1 = __importDefault(require("../helper/MainEntityHelper"));
const GlobalEventModel_1 = __importDefault(require("../../src/model/event/GlobalEventModel"));
const Events_1 = require("../../src/model/event/Events");
const TestHelper_1 = require("../helper/TestHelper");
let uuid4 = require('uuid/v4');
describe('Update', () => {
    it('Main', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        let entity = yield MainEntityHelper_1.default.create();
        entity.name = `changed${uuid4()}`;
        entity.data = {
            test: 123,
        };
        let entityAfter = yield MainModel_1.default.updateAsync(entity);
        yield MainEntityHelper_1.default.checkAllData(entity, entityAfter);
        let entityUpdated = yield MainModel_1.default.getAsync(entity.id);
        yield MainEntityHelper_1.default.checkAllData(entity, entityUpdated);
    }));
    it('Main with Parent - remove', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        let entity = yield MainEntityHelper_1.default.create({ withParent: true });
        entity.parent = undefined;
        entity.name = `changed${uuid4()}`;
        entity.data = {
            test: 123,
        };
        let entityAfter = yield MainModel_1.default.updateAsync(entity);
        yield MainEntityHelper_1.default.checkAllData(entity, entityAfter);
        let entityUpdated = yield MainModel_1.default.getAsync(entity.id);
        yield MainEntityHelper_1.default.checkAllData(entity, entityUpdated);
    }));
    it('Event', () => {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            TestHelper_1.testHelper.prepare();
            let can = true;
            GlobalEventModel_1.default.getEmitter().on(Events_1.EVENT_ENTITY_UPDATED, (data) => __awaiter(void 0, void 0, void 0, function* () {
                if (!can)
                    return;
                can = false;
                yield MainEntityHelper_1.default.checkAllData(data.entity.props, entity);
                resolve();
            }));
            let entity = yield MainEntityHelper_1.default.create();
            entity.name = `changed${uuid4()}`;
            yield MainModel_1.default.updateAsync(entity);
        }));
    });
    describe('JSON field', () => {
        it('append', () => __awaiter(void 0, void 0, void 0, function* () {
            let entity = yield MainEntityHelper_1.default.create();
            entity.data.someNew = 123;
            let data = JSON.stringify(entity.data);
            let entityUpdated = yield MainModel_1.default.updateJsonFieldAsync(entity, 'data');
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        }));
        it('change', () => __awaiter(void 0, void 0, void 0, function* () {
            let entity = yield MainEntityHelper_1.default.create();
            let keys = Object.keys(entity.data);
            entity.data.hello = entity.data.hello.split("").reverse().join("");
            let data = JSON.stringify(entity.data);
            let entityUpdated = yield MainModel_1.default.updateJsonFieldAsync(entity, 'data');
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        }));
        it('clear value', () => __awaiter(void 0, void 0, void 0, function* () {
            let entity = yield MainEntityHelper_1.default.create();
            let keys = Object.keys(entity.data);
            entity.data.hello = undefined;
            let data = JSON.stringify(entity.data);
            entity.data.hello = null;
            let entityUpdated = yield MainModel_1.default.updateJsonFieldAsync(entity, 'data');
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        }));
    });
});
//# sourceMappingURL=update.test.js.map