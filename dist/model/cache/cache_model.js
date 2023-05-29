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
Object.defineProperty(exports, "__esModule", { value: true });
class CacheModel {
    constructor(options) {
        options = Object.assign({
            type: 'memory'
        }, options);
    }
    /**
     * Get Entity from source
     * @param id
     * @param options
     */
    get(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     *
     * @param id
     * @param options
     */
    set(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.default = CacheModel;
//# sourceMappingURL=cache_model.js.map