import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import mainEntityHelper from "../helper/MainEntityHelper";
import globalEventModel from "../../src/model/event/GlobalEventModel";
import {EVENT_ENTITY_UPDATED} from "../../src/model/event/Events";
import {testHelper} from "../helper/TestHelper";


let uuid4 = require('uuid/v4');

describe('Update', () => {
    it('Main', async () => {
        await testHelper.prepare();
        let entity = await mainEntityHelper.create();
        entity.name = `changed${uuid4()}`;
        entity.data = {
            test: 123,
        };


        let entityAfter = await mainModel.updateAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity, entityAfter);
        let entityUpdated = await mainModel.getAsync(entity.id) as Main;
        await mainEntityHelper.checkAllData(entity, entityUpdated);

    });

    it('Main with Parent - remove', async () => {
        await testHelper.prepare();
        let entity = await mainEntityHelper.create({withParent: true});
        entity.parent = undefined;
        entity.name = `changed${uuid4()}`;
        entity.data = {
            test: 123,
        };

        let entityAfter = await mainModel.updateAsync(entity) as Main;
        await mainEntityHelper.checkAllData(entity, entityAfter);
        let entityUpdated = await mainModel.getAsync(entity.id) as Main;
        await mainEntityHelper.checkAllData(entity, entityUpdated);
    });

    it('Event', () => {
        return new Promise(async (resolve) => {

            await testHelper.prepare();
            let can = true;
            globalEventModel.getEmitter().on(EVENT_ENTITY_UPDATED, async (data) => {
                if (!can) return;
                can = false;
                await mainEntityHelper.checkAllData(data.entity.props, entity);
                resolve(undefined);
            });
            let entity = await mainEntityHelper.create();
            entity.name = `changed${uuid4()}`;
            await mainModel.updateAsync(entity);
        });
    });

    describe('JSON field', () => {
        it('append', async () => {
            let entity = await mainEntityHelper.create();
            entity.data.someNew = 123;
            let data = JSON.stringify(entity.data);
            let entityUpdated = await mainModel.updateJsonFieldAsync(entity, 'data') as Main;
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        });

        it('change', async () => {
            let entity = await mainEntityHelper.create();
            let keys = Object.keys(entity.data);
            entity.data.hello = entity.data.hello.split("").reverse().join("");
            let data = JSON.stringify(entity.data);
            let entityUpdated = await mainModel.updateJsonFieldAsync(entity, 'data') as Main;
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        });

        it('clear value', async () => {
            let entity = await mainEntityHelper.create();
            let keys = Object.keys(entity.data);
            entity.data.hello = undefined;
            let data = JSON.stringify(entity.data);
            entity.data.hello = null;
            let entityUpdated = await mainModel.updateJsonFieldAsync(entity, 'data') as Main;
            expect(JSON.stringify(entityUpdated.data)).toBe(data);
        });
    });
});

