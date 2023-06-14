"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ESSerializer = require('esserializer');
class CacheBaseModel {
    constructor(options) {
        this.options = options;
    }
    encode(data, options) {
        ESSerializer.registerClasses(options.classes);
        return ESSerializer.serialize(data);
    }
    decode(serialized, options) {
        ESSerializer.registerClasses(options.classes);
        return ESSerializer.deserialize(serialized, options.classes);
    }
}
exports.default = CacheBaseModel;
//# sourceMappingURL=CacheBaseModel.js.map