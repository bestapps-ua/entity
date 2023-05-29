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
const Main_1 = __importDefault(require("../entity/Main"));
const MainModel_1 = __importDefault(require("../model/MainModel"));
let uuid4 = require('uuid/v4');
class MainEntityHelper {
    generate(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let source = {
                name: `test${uuid4()}`,
                data: {
                    item: 1,
                    hello: 'world',
                }
            };
            const entity = new Main_1.default(source);
            if (options.withParent) {
                let entityParent = yield this.generate();
                let parent = yield MainModel_1.default.createAsync(entityParent);
                entity.parent = parent;
            }
            return entity;
        });
    }
    checkAllData(source, entity, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            expect(entity.id).toBeGreaterThan(0);
            expect(entity.created).toBeGreaterThan(0);
            expect(entity.uid).toBeDefined();
            expect(source.name).toBe(entity.name);
            expect(JSON.stringify(source.data)).toBe(JSON.stringify(entity.data));
            if (options.withParent) {
                let parent = yield entity.parent;
                expect(parent instanceof Main_1.default).toBe(true);
                yield this.checkAllData(parent.props, parent);
            }
        });
    }
    create(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.generate(options);
            let data = yield MainModel_1.default.createAsync(entity);
            return data;
        });
    }
}
exports.default = new MainEntityHelper();
//# sourceMappingURL=MainEntityHelper.js.map