import mainModel from "../model/MainModel";
import {TestHelper, testHelper} from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";
import Main from "../entity/Main";
import * as BestApps from "../../src";
import IEntityItemsWhere = BestApps.interfaces.IEntityItemsWhere;
import IEntityItemsParams = BestApps.interfaces.IEntityItemsParams;

let uuid4 = require('uuid/v4');


class TestSortHelper extends TestHelper {
    beforeEach(callback: any = undefined) {
        let cb = async (done) => {
            await mainModel.truncate();
            if (callback) {
                callback(done)
            } else {
                done();
            }
        };
        super.beforeEach(cb);
    }
}

const testSortHelper = new TestSortHelper();

async function createList(options: any = {}) {
    let counters: any = {};

    function getCounter(name: string) {
        if (!counters[name]) {
            counters[name] = 0;
        }
        return counters[name];
    }

    function incCounter(name: string) {
        if (!counters[name]) {
            counters[name] = 0;
        }
        counters[name]++;
    }

    options = Object.assign({
        limit: 5,
    }, options);

    let items: Main[] = [];

    for (let i = 0; i < options.limit; i++) {
        let opts: any = {};

        if (options.some) {
            let counter = getCounter('some');
            if (counter < options.some.limit) {
                opts.some = options.some.value;
                incCounter('some');
            }
        }

        if (options.withChild) {
            let counter = getCounter('child');
            if (counter < options.withChild.limit) {
                opts.withChild = true;
                incCounter('child');
            }
        }
        const entity = await mainEntityHelper.create(opts);
        items.push(entity);
    }
    return items;
}

describe('Sort', () => {

    it('by Function', async () => {
        await testSortHelper.prepare();
        const some = `test-${uuid4()}`;
        let items = await createList({some: {limit: 3, value: some}});
        let params: IEntityItemsParams = {
            sort: {
                field: {
                    type: 'function',
                    data: {
                        schema: 'IF(:field LIKE :val, 1, 0)',
                        field: [
                            {
                                key: {
                                    schema: 'field',
                                    value: 'some'
                                }
                            },
                            {
                                value: {
                                    schema: 'val',
                                    value: '%test%'
                                }
                            }
                        ]
                    }
                },
                order: 'ASC'
            }
        };
        let res = await mainModel.getItemsAsync(params) as Main[];
        expect(res.length).toBe(5);
        for (let i = 0; i < res.length; i++) {
            if(i < 2) {
                expect(res[i].some).toBe(null);
            }else{
                expect(res[i].some).not.toBe(null);
            }
        }
    });
});
