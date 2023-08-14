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
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(props) {
        this._props = props;
        this._id = props.id;
        this._uid = props.uid;
        this._created = props.created;
        this._system = props.system;
    }
    /**
     * For lazy load please use this method
     * @param property
     * @private
     */
    _get(property) {
        if (typeof this[property] === 'function') {
            return this[property]()();
        }
        return this[property];
    }
    get props() {
        return this._props;
    }
    get id() {
        return this._get('_id');
    }
    get created() {
        return this._get('_created');
    }
    getClassName() {
        let name = this.constructor.name;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        return name;
    }
    get allData() {
        let properties = Object.getOwnPropertyNames(this);
        let data = {};
        (() => __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < properties.length; i++) {
                let property = properties[i];
                property = property.substring(1);
                if (this[properties[i]] instanceof Entity) {
                    data[property] = this[properties[i]].allData;
                }
                else {
                    data[property] = yield this[properties[i]];
                }
            }
        }))();
        return data;
    }
    get uid() {
        return this._get('_uid');
    }
    set uid(value) {
        this._uid = value;
    }
    getModifiedProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            let modified = [];
            for (const property in this.props) {
                if (this.props[property] !== this[property]) {
                    modified.push(property);
                }
            }
            return modified;
        });
    }
    get system() {
        return this._system;
    }
    set system(value) {
        this._system = value;
    }
}
exports.default = Entity;
//# sourceMappingURL=Entity.js.map