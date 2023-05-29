"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityModel {
    constructor(options) {
        this.entity = options.entity;
        this.options = options;
    }
    get entity() {
        if (!this._entity)
            throw 'Please set entity in options';
        return this._entity;
    }
    set entity(value) {
        this._entity = value;
    }
    get(id, callback) {
        return callback && callback();
    }
}
exports.default = EntityModel;
//# sourceMappingURL=EntityModel.js.map