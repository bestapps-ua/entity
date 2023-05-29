"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("../../src/entity/Entity"));
class Main extends Entity_1.default {
    constructor(props) {
        super(props);
        this._name = props.name;
        this._parent = props.parent;
        this._data = props.data;
    }
    get data() {
        return this._get('_data');
    }
    set data(value) {
        this._data = value;
    }
    get parent() {
        return this._get('_parent');
    }
    set parent(value) {
        this._parent = value;
    }
    get name() {
        return this._get('_name');
    }
    set name(value) {
        this._name = value;
    }
}
exports.default = Main;
//# sourceMappingURL=Main.js.map