import sql from './SQLModel';
import EntitySQLModel from "../../src/model/entity/EntitySQLModel";
import IEntitySQLModelOptions from "../../src/interface/entity/sql/IEntitySQLModelOptions";
import Main from "../entity/Main";

let options: IEntitySQLModelOptions = {
    sql,
    table: 'main',
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
