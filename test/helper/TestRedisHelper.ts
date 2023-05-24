import {TestHelper} from "./TestHelper";
import RegistryModel from "../../src/model/RegistryModel";

export class TestRedisHelper extends TestHelper {
    afterAll(callback: any = undefined) {
        let cb = async (done) => {
            let redisClient = RegistryModel.get('redisClient');
            if (redisClient) {
                await redisClient.disconnect();
            }
            done();
        };
        super.afterAll(cb);
    }
}

let testRedisHelper = new TestRedisHelper();
export {testRedisHelper};
