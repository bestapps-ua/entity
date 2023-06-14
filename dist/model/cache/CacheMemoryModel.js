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
const CacheBaseModel_1 = __importDefault(require("./CacheBaseModel"));
let storage = new Map();
class CacheMemoryModel extends CacheBaseModel_1.default {
    constructor(options) {
        super(options);
    }
    fetch(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return storage.get(id);
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
            storage.set(id, data);
        });
    }
    invalidateAll() {
        return __awaiter(this, void 0, void 0, function* () {
            storage.clear();
        });
    }
    invalidate(id) {
        return __awaiter(this, void 0, void 0, function* () {
            storage.delete(id);
        });
    }
}
exports.default = CacheMemoryModel;
//# sourceMappingURL=CacheMemoryModel.js.map