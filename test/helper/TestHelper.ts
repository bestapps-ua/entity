import sql from "../model/SQLModel";
import globalEventModel from "../../src/model/event/GlobalEventModel";
import appModel from '../../src/model/AppModel';
import {EVENT_SQL_CONNECTED, EVENT_SQL_MODELS_LOADED} from "../../src/model/event/Events";

appModel.init();

export class TestHelper {
    isLoaded: boolean = false;
    constructor() {
        this.beforeEach();
        this.beforeAll();
        this.afterAll();
    }

    async prepare() {
        if(this.isLoaded) {
            return true;
        }
        await new Promise((resolve) => {
            globalEventModel.getEmitter().on(EVENT_SQL_MODELS_LOADED, async (data) => {
                this.isLoaded = true;
                resolve(undefined);
            });
        });
    }

    beforeAll(callback = undefined) {

        beforeAll(done => {
            if (callback) {
                callback(done)
            } else {
                done();
            }
        });
    }

    afterAll(callback = undefined) {
        afterAll(done => {
            sql.connectionEnd(() => {
                if (callback) {
                    callback(done)
                } else {
                    done();
                }
            });
        });
    }

    beforeEach(callback = undefined) {

        beforeEach(done => {
            if (callback) {
                callback(done)
            } else {
                done();
            }
        });
    }
}

let testHelper = new TestHelper();
export {testHelper};
