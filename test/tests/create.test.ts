import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import {testHelper} from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";
import globalEventModel from "../../src/model/event/GlobalEventModel";
import {EVENT_ENTITY_CREATED} from "../../src/model/event/Events";
import childEntityHelper from "../helper/ChildEntityHelper";
import childModel from "../model/ChildModel";
import Child from "../entity/Child";


describe('Create', () => {

    it('Main', async () => {
        await testHelper.prepare();
        const entity = await mainEntityHelper.generate();
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data);
    });

    it('Main with Parent', async () => {
        await testHelper.prepare();
        const entity = await mainEntityHelper.generate({withParent: true});
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data, {withParent: true});
    });

    it('Event', async () => {
        await testHelper.prepare();
        let can = true;
        return new Promise(async (resolve) => {
            globalEventModel.getEmitter().on(EVENT_ENTITY_CREATED, async (data) => {
                if(!can) return ;
                can = false;
                await mainEntityHelper.checkAllData(data.entity.props, data.entity);
                resolve(undefined);
            });
            await mainEntityHelper.create();
        });
    });

    it('Main with Special', async () => {
        await testHelper.prepare();
        const entity = await mainEntityHelper.generate({withSpecial: true});
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data, {withSpecial: true});
    });

    it('Child with Main', async () => {
        await testHelper.prepare();
        const entity = await childEntityHelper.generate();
        let data = await childModel.createAsync(entity) as Child;
        await childEntityHelper.checkAllData(entity.props, data);
    });

    it('Special not filled', async () => {
        await testHelper.prepare();
        const entity = await mainEntityHelper.generate({withSpecialCutted: true});
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity.props, data, {withSpecialCutted: true});
    });

    //TODO: test with field which is in source and with _, but not have callback or model
});

