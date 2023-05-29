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
function check(type, options = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        let limit = options && options.limit;
        let ids = [];
        for (let i = 0; i < 5; i++) {
            const entity = yield MainEntityHelper_1.default.create();
            ids.push(entity.id);
        }
        let params = {};
        let where = [
            {
                key: 'id',
                equal: 'IN',
                value: ids,
            }
        ];
        if (type === 'filters') {
            params.filters = { where };
        }
        if (type === 'where') {
            params.where = where;
        }
        if (limit) {
            params.limit = limit;
        }
        let res = yield MainModel_1.default.getItemsAsync(params);
        if (limit) {
            expect(res.length).toBe(limit);
        }
        else {
            expect(res.length).toBe(ids.length);
        }
        for (const item of res) {
            expect(ids.includes(item.id)).toBe(true);
        }
        let count = yield MainModel_1.default.getItemsCountAsync(params);
        expect(count).toBe(ids.length);
    });
}
describe('List', () => {
    it('Filters', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        yield check('filters');
    }));
    it('Where without Filters', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        yield check('where');
    }));
    it('Limit', () => __awaiter(void 0, void 0, void 0, function* () {
        TestHelper_1.testHelper.prepare();
        yield check('where', { limit: 3 });
    }));
});
//# sourceMappingURL=list.test.js.map