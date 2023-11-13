import mainModel from "../model/MainModel";
import {TestHelper, testHelper} from "../helper/TestHelper";
import mainEntityHelper from "../helper/MainEntityHelper";
import Main from "../entity/Main";
import * as BestApps from "../../src";
import IEntityItemsWhere = BestApps.interfaces.IEntityItemsWhere;
import IEntityItemsParams = BestApps.interfaces.IEntityItemsParams;

let uuid4 = require('uuid/v4');


class TestWhereHelper extends TestHelper {
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

const testWhereHelper = new TestWhereHelper();

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

async function check(where: IEntityItemsWhere | IEntityItemsWhere[], limit: number, isSpecial = false) {
    let res = await mainModel.getItemsAsync({where});
    if(isSpecial){
        console.log(res);
    }
    expect(res.length).toBe(limit);
    return res;
}

describe('Where', () => {

    it('Simple Key = Value', async () => {
        await testWhereHelper.prepare();
        const some = `test-${uuid4()}`;
        await createList({some: {limit: 3, value: some}});
        let where = [
            {
                key: 'some',
                value: some,
            }
        ];
        await check(where, 3);
    });

    it('Key with null and "null" Value', async () => {
        await testWhereHelper.prepare();
        await createList();
        let where: any = {
            key: 'some',
            equal: 'is',
            value: null,
        };
        await check(where, 5);
        where = {
            key: 'some',
            equal: 'is',
            value: 'null',
        };
        await check(where, 5);
        where = {
            key: 'some',
            value: 'null',
        };
        await check(where, 5);
    });

    it('Key with not null Value', async () => {
        await testWhereHelper.prepare();
        const some = `test-${uuid4()}`;
        await createList({some: {limit: 5, value: some}});
        let where: any = {
            key: 'some',
            equal: 'is',
            value: 'not null',
        };
        await check(where, 5);
        where = {
            key: 'some',
            value: 'not null',
        };
        await check(where, 5);
    });

    it('Key is a Function', async () => {
        await testWhereHelper.prepare();
        const some = `test`;
        await createList({some: {limit: 5, value: some}});
        let where: any = {
            key: {
                type: 'function',
                data: {
                    schema: 'LENGTH(:field)',
                    field: {
                        key: {
                            schema: 'field',
                            value: 'some'
                        }
                    }
                }
            },
            value: 4,
        };
        await check(where, 5);
    });

    it('Value is a Function', async () => {
        await testWhereHelper.prepare();
        const some = `test`;
        await createList({some: {limit: 5, value: some}});
        let where: any = {
            key: 'some',
            value: {
                type: 'function',
                data: {
                    schema: 'CONCAT(LEFT(:field, 3), :val)',
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
                                value: 't'
                            }
                        }
                    ]
                }
            }
        };
        await check(where, 5);
    });

    it('Key and Value is a Function', async () => {
        await testWhereHelper.prepare();
        const some = `test`;
        await createList({some: {limit: 5, value: some}});
        let where: any = {
            key: {
                type: 'function',
                data: {
                    schema: 'CONCAT(:field, "")',
                    field: {
                        key: {
                            schema: 'field',
                            value: 'some'
                        }
                    }
                }
            },
            value: {
                type: 'function',
                data: {
                    schema: 'CONCAT(LEFT(:field, 3), :val)',
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
                                value: 't'
                            }
                        }
                    ]
                }
            }
        };
        await check(where, 5);
    });

    it('Between ? and ?', async () => {
        await testWhereHelper.prepare();
        await createList({some: {limit: 1, value: 1}});
        await createList({some: {limit: 1, value: 2}});
        await createList({some: {limit: 1, value: 3}});
        let where = [
            {
                key: 'some',
                equal: 'between',
                value: [2, 3],
            }
        ];
        await check(where, 2);
    });

    it('LEFT JOIN with Key = Value', async () => {
        await testWhereHelper.prepare();
        const some = `test`;
        await createList({withChild: {limit: 5}});
        let params: IEntityItemsParams = {
            filters: {
                join: {
                    table: 'child',
                    type: 'left join',
                    on: [
                        {
                            key: 'child.name',
                            equal: 'LIKE',
                            value: '%test%',
                        }
                    ]
                }
            }
        };
        let res = await mainModel.getItemsAsync(params);
        expect(res.length).toBe(5 * 5);
    });

    it('LEFT JOIN with Key = Field', async () => {
        await testWhereHelper.prepare();
        let items = await createList({withChild: {limit: 5}});
        let params: IEntityItemsParams = {
            filters: {
                join: {
                    table: 'child',
                    type: 'left join',
                    on: [
                        {
                            key: 'child.main_id',
                            field: 'main.id',
                        },
                    ]
                }
            }
        };
        let res = await mainModel.getItemsAsync(params);
        expect(res.length).toBe(5);
    });

});
