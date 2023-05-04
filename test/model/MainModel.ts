import sql from './SQLModel';
import EntitySQLModel from "../../src/model/entity/EntitySQLModel";
import IEntitySQLModelOptions from "../../src/interface/entity/sql/IEntitySQLModelOptions";
import Entity from "../../src/entity/Entity";

//TODO: parent to optional + lazy
let options: IEntitySQLModelOptions = {
    sql,
    table: 'main',
    entity: Entity,
    make: {
        schemas: [{
            field: 'parent',
            source: {
                id: 'pid',
                model: 'this',
                isLazy: true,
                optional: true,
            },
        }]
    }
};

class MainModel extends EntitySQLModel {

}

export default new MainModel(options);
