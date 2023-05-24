import {testRedisHelper} from "../../helper/TestRedisHelper";
import mainEntityHelper from "../../helper/MainEntityHelper";
import mainModel from "../../model/MainModel";
import {CACHE_TYPE_REDIS} from "../../../src/model/cache/CacheFactoryModel";
import Main from "../../entity/Main";
import cacheHelper from "../../helper/CacheHelper";

describe('Cache', () => {
    it('Main', async (done) => {
        testRedisHelper.prepare();
        const entity = await mainEntityHelper.generate();
        mainModel.setCacheModel(cacheHelper.getFactory(CACHE_TYPE_REDIS));
        mainModel.setCacheTtl(1);
        mainModel.setCacheCanFetch(true);
        mainModel.setCacheCanStore(true);
        let mainEntity = await mainModel.createAsync(entity) as Main;

        expect(mainEntity.system.isCache).toBe(false);
        mainEntity = await mainModel.getAsync(mainEntity.id) as Main;
        expect(mainEntity.system.isCache).toBe(true);
        setTimeout(async () => {
            mainEntity = await mainModel.getAsync(mainEntity.id) as Main;
            expect(mainEntity.system.isCache).toBe(false);
            done();
        }, 1001);
    });
});
