'use strict';

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

export default new GlobalEventModel();
