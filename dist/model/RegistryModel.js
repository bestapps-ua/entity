"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let models = new Map();
class RegistryModel {
    static set(key, value) {
        models.set(key, value);
    }
    static get(key) {
        return models.get(key);
    }
    static keys() {
        return models.keys();
    }
}
exports.default = RegistryModel;
//# sourceMappingURL=RegistryModel.js.map