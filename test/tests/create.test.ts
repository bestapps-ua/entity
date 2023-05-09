import mainModel from "../model/MainModel";
import Main from "../entity/Main";
import sql from "../model/SQLModel";

beforeAll(done => {
    done();
})

afterAll(done => {
    sql.connectionEnd(() => {
        done();
    });
})

test('create main', async (done) => {
    let entity = new Main({
        name: `test${Date.now()}`,
        data: {
            item: 1,
            hello: 'world',
        }
    });
    let data = await mainModel.createAsync(entity);
    console.log('[RESULT]',data);
    done();
});
