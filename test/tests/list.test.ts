import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import {testHelper} from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";

async function check(type, options: any = undefined) {
    let limit = options && options.limit;
    let ids: number[] = [];
    for (let i = 0; i < 5; i++) {
        const entity = await mainEntityHelper.create();
        ids.push(entity.id);
    }

    let params: any = {};
    let where = [
        {
            key: 'id',
            equal: 'IN',
            value: ids,
        }
    ];
    if (type === 'filters') {
        params.filters = {where};
    }
    if (type === 'where') {
        params.where = where;
    }

    if (limit) {
        params.limit = limit;
    }
    let res = await mainModel.getItemsAsync(params);

    if (limit) {
        expect(res.length).toBe(limit);
    }else{
        expect(res.length).toBe(ids.length);
    }

    for (const item of res) {
        expect(ids.includes(item.id)).toBe(true);
    }
    let count = await mainModel.getItemsCountAsync(params);

    expect(count).toBe(ids.length);
}

describe('List', () => {
    it('Filters', async () => {
        await testHelper.prepare();
        await check('filters');
    });

    it('Where without Filters', async () => {
        await testHelper.prepare();
        await check('where');
    });

    it('Limit', async () => {
        await testHelper.prepare();
        await check('where', {limit: 3});
    });
});
