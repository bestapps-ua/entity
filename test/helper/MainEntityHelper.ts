import Main from "../entity/Main";
import mainModel from "../model/MainModel";

let uuid4 = require('uuid/v4');

class MainEntityHelper {

    async generate(options: any = {}): Promise<Main> {
        let source = {
            name: `test${uuid4()}`,
            data: {
                item: 1,
                hello: 'world',
            }
        }
        const entity = new Main(source);
        if (options.withParent) {
            let entityParent = await this.generate();
            let parent = await mainModel.createAsync(entityParent) as Main;
            entity.parent = parent;
        }
        return entity;
    }

    async checkAllData(source, entity: Main, options: any = {}) {
        expect(entity.id).toBeGreaterThan(0);
        expect(entity.created).toBeGreaterThan(0);
        expect(entity.uid).toBeDefined();
        expect(source.name).toBe(entity.name);
        expect(JSON.stringify(source.data)).toBe(JSON.stringify(entity.data));
        if (options.withParent) {
            let parent = await entity.parent;
            expect(parent instanceof Main).toBe(true);
            await this.checkAllData(parent.props, parent);
        }
    }

    async create(options: any = {}): Promise<Main> {
        const entity = await this.generate(options);
        let data = await mainModel.createAsync(entity) as Main;
        return data;
    }
}

export default new MainEntityHelper();
