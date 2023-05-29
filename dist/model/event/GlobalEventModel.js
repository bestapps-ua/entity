'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let EventEmitter = require('events');
let eventEmitter = new EventEmitter();
class GlobalEventModel {
    constructor() {
        //@ts-ignore
        this.eventEmitter = eventEmitter;
    }
    getEmitter() {
        //@ts-ignore
        return this.eventEmitter;
    }
}
exports.default = new GlobalEventModel();
//# sourceMappingURL=GlobalEventModel.js.map