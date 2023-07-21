import {testHelper} from "../../helper/TestHelper";
import mainEntityHelper from "../../helper/MainEntityHelper";
import mainModel from "../../model/MainModel";
import Main from "../../entity/Main";
import {CACHE_TYPE_MEMORY, CacheFactoryModel} from "../../../src/model/cache/CacheFactoryModel";
import cacheHelper from "../../helper/CacheHelper";

describe('Cache', () => {
    it('Main', async () => {
        return new Promise(async (resolve) => {
            await testHelper.prepare();
            const entity = await mainEntityHelper.generate();
            mainModel.setCacheModel(cacheHelper.getFactory(CACHE_TYPE_MEMORY));
            mainModel.setCacheTtl(1);
            mainModel.setCacheCanFetch(true);
            mainModel.setCacheCanStore(true);
            let mainEntity = await mainModel.createAsync(entity) as Main;
            expect(mainEntity.system.isCache).toBe(false);
            mainEntity = await mainModel.getAsync(mainEntity.id) as Main;
            expect(mainEntity.system.isCache).toBe(true);
            expect(mainEntity.system.type === CACHE_TYPE_MEMORY).toBe(true);

            setTimeout(async () => {
                mainEntity = await mainModel.getAsync(mainEntity.id) as Main;
                expect(mainEntity.system.isCache).toBe(false);
                resolve(undefined);
            }, 1001);
        });
    });
});
