"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("../../src/entity/Entity"));
class Child extends Entity_1.default {
    constructor(props) {
        super(props);
        this._name = props.name;
        this._main = props.main;
    }
    get name() {
        return this._get('_name');
    }
    set name(value) {
        this._name = value;
    }
    get main() {
        return this._get('_main');
    }
    set main(value) {
        this._main = value;
    }
}
exports.default = Child;
//# sourceMappingURL=Child.js.map