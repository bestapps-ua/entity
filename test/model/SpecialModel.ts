import EntitySQLModel from "../../src/model/entity/EntitySQLModel";
import IEntitySQLModelOptions from "../../src/interface/entity/sql/IEntitySQLModelOptions";
import Special from "../entity/Special";

let options: IEntitySQLModelOptions = {
    table: 'special',
    entity: Special,
    schemas: [
        {
            field: 'name'
        },
        {
            field: 'guid',
            type: 'uid',
        },
        {
            field: 'ct',
            type: 'created',
        },
    ]
};

class SpecialModel extends EntitySQLModel {

}

let specialModel = new SpecialModel(options);

let optionsCut: IEntitySQLModelOptions = {
    table: 'special',
    entity: Special,
    schemas: [
        {
            field: 'name'
        },
    ]
};

class SpecialCutModel extends EntitySQLModel {

}

let specialCutModel= new SpecialCutModel(optionsCut);

export {
    specialModel,
    specialCutModel,
}
