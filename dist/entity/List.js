"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
class List extends Entity_1.default {
    constructor(props) {
        super(props);
        this._items = [];
        this._items = props.items;
        this._pager = props.pager;
    }
    get pager() {
        return this._pager;
    }
    set pager(value) {
        this._pager = value;
    }
    get items() {
        return this._items;
    }
    set items(value) {
        this._items = value;
    }
}
exports.default = List;
//# sourceMappingURL=List.js.map