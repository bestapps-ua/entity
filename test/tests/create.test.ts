import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import sql from "../model/SQLModel";
import testHelper from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";


describe('Create', () => {
    it('Main', async () => {
        testHelper.prepare();
        const entity = await mainEntityHelper.generate();
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkCreated(entity.props, data);
    });

    it('Main with Parent', async () => {
        testHelper.prepare();
        const entity = await mainEntityHelper.generate({withParent: true});
        let data = await mainModel.createAsync(entity) as Main;
        await mainEntityHelper.checkCreated(entity.props, data, {withParent: true});
    });
});
