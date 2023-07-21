import Special from "../entity/Special";
import {specialModel, specialCutModel} from "../model/SpecialModel";
import {checkUid} from "../tools";

let uuid4 = require('uuid/v4');

class SpecialEntityHelper {

    async generate(options: any = {}): Promise<Special> {
        let source = {
            name: `test${uuid4()}`,
        }
        const entity = new Special(source);
        return entity;
    }

    async checkAllData(source, entity: Special, options: any = {}) {
        expect(entity.id).toBeGreaterThan(0);
        if (options.isCutted) {
            expect(entity.ct).toBe(0);
            expect(entity.guid).toBe('');
        } else {
            expect(entity.ct).toBeGreaterThan(0);
            checkUid(entity.guid);
        }
        expect(source.name).toBe(entity.name);
    }

    async create(options: any = {}): Promise<Special> {
        const entity = await this.generate(options);
        let data = options.isCutted ? await specialCutModel.createAsync(entity) as Special : await specialModel.createAsync(entity) as Special;
        return data;
    }
}

export default new SpecialEntityHelper();
