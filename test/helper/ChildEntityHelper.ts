import Child from "../entity/Child";
import childModel from "../model/ChildModel";
import mainEntityHelper from "./MainEntityHelper";
import {checkUid} from "../tools";

let uuid4 = require('uuid/v4');

class ChildEntityHelper {

    async generate(options: any = {}): Promise<Child> {
        let source = {
            name: `test${uuid4()}`,
            main: undefined,
        }
        let main = await mainEntityHelper.create();
        source.main = main;
        const entity = new Child(source);
        return entity;
    }

    async checkAllData(source, entity: Child, options: any = {}) {
        expect(entity.id).toBeGreaterThan(0);
        expect(entity.created).toBeGreaterThan(0);
        checkUid(entity.uid);
        expect(entity.main).toBeDefined();
        expect(source.name).toBe(entity.name);
    }

    async create(options: any = {}): Promise<Child> {
        const entity = await this.generate(options);
        let data = await childModel.createAsync(entity) as Child;
        return data;
    }
}

export default new ChildEntityHelper();
