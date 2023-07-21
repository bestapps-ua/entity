import Main from "../entity/Main";
import mainModel from "../model/MainModel";
import specialEntityHelper from "./SpecialEntityHelper";
import {checkUid} from "../tools";

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
        if(options.withSpecial || options.withSpecialCutted) {
            let opts = {
                isCutted: options.withSpecialCutted,
            };
            let special = await specialEntityHelper.create(opts);
            entity.special = special;
        }
        if(options.withChild) {
            let special = await specialEntityHelper.create();
            entity.special = special;
        }
        return entity;
    }

    async checkAllData(source, entity: Main, options: any = {}) {
        expect(entity.id).toBeGreaterThan(0);
        expect(entity.created).toBeGreaterThan(0);
        checkUid(entity.uid);
        expect(source.name).toBe(entity.name);
        expect(JSON.stringify(source.data)).toBe(JSON.stringify(entity.data));
        if (options.withParent) {
            let parent = await entity.parent;
            expect(parent instanceof Main).toBe(true);
            await this.checkAllData(parent.props, parent);
        }

        if(options.withSpecial || options.withSpecialCutted) {
            let current = await mainModel.getAsync(entity.id) as Main;
            let special = await current.special;
            let opts = {
                isCutted: options.withSpecialCutted,
            };
            await specialEntityHelper.checkAllData(special.props, special, opts);
        }
    }

    async create(options: any = {}): Promise<Main> {
        const entity = await this.generate(options);
        let data = await mainModel.createAsync(entity) as Main;
        return data;
    }
}

export default new MainEntityHelper();
