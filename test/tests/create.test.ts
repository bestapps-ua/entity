import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import {testHelper} from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";
import globalEventModel from "../../src/model/event/GlobalEventModel";
import {EVENT_ENTITY_CREATED} from "../../src/model/event/Events";


describe('Create', () => {
    it('Main', async () => {
        testHelper.prepare();
        const entity = await mainEntityHelper.generate();
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data);
    });

    it('Main with Parent', async () => {
        testHelper.prepare();
        const entity = await mainEntityHelper.generate({withParent: true});
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data, {withParent: true});
    });

    it('Event', async () => {
        testHelper.prepare();
        let can = true;
        return new Promise(async (resolve) => {
            globalEventModel.getEmitter().on(EVENT_ENTITY_CREATED, async (data) => {
                if(!can) return ;
                can = false;
                await mainEntityHelper.checkAllData(data.entity.props, data.entity);
                resolve();
            });
            await mainEntityHelper.create();
        });
    });
});

