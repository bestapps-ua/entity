import EntitySQLModel from "../../src/model/entity/EntitySQLModel";
import IEntitySQLModelOptions from "../../src/interface/entity/sql/IEntitySQLModelOptions";
import Main from "../entity/Main";
import {specialModel} from "./SpecialModel";

let options: IEntitySQLModelOptions = {
    table: 'main',
    //@ts-ignore
    entity: Main,
    schemas: [
        {
            field: 'parent',
            source: {
                id: 'pid',
                model: 'this',
            },
            isLazy: true,
            optional: true,
        },
        {
            field: 'special',
            source: {
                id: 'special_id',
                callback: (id, callback) => {
                    specialModel.get(id, callback);
                },
            },
            isLazy: true,
            optional: true,
        },
        {
            field: 'name'
        },
        {
            field: 'data',
            type: 'json',
        },
    ]
};

class MainModel extends EntitySQLModel {

}

export default new MainModel(options);
