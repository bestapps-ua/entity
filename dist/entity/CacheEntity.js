"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheEntity {
    constructor(data) {
        this._data = data.data;
        this._expires = data.expires;
        this._ttl = data.ttl;
        this._created = Date.now() / 1000;
    }
    get expires() {
        return this._expires;
    }
    set expires(value) {
        this._expires = value;
    }
    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }
    get created() {
        return this._created;
    }
    set created(value) {
        this._created = value;
    }
    get ttl() {
        return this._ttl;
    }
}
exports.default = CacheEntity;
//# sourceMappingURL=CacheEntity.js.map