import sql from "../model/SQLModel";

class TestHelper {
    constructor() {
        beforeAll(done => {
            done();
        });

        afterAll(done => {
            sql.connectionEnd(() => {
                done();
            });
        });
    }

    prepare() {

    }
}

export default new TestHelper();
