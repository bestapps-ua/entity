'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let EventEmitter = require('events');
let eventEmitter = new EventEmitter();
class GlobalEventModel {
    constructor() {
        this.eventEmitter = eventEmitter;
    }
    getEmitter() {
        return this.eventEmitter;
    }
}
exports.default = new GlobalEventModel();
//# sourceMappingURL=GlobalEventModel.js.map