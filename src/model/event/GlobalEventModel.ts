'use strict';

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

export default new GlobalEventModel();
