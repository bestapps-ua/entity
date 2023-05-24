import sql from "../model/SQLModel";
import RegistryModel from "../../src/model/RegistryModel";

export class TestHelper {
    constructor() {
        this.beforeAll();
        this.afterAll();
    }

    prepare() {
    }

    beforeAll(callback = undefined){
        beforeAll(done => {
            if(callback) {
                callback(done)
            }else{
                done();
            }
        });
    }

    afterAll(callback = undefined){
        afterAll(done => {
            sql.connectionEnd(() => {
                if(callback) {
                    callback(done)
                }else{
                    done();
                }
            });
        });
    }
}

let testHelper = new TestHelper();
export {testHelper};
