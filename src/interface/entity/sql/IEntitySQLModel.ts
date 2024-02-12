import IEntitySQLModelOptions from "./IEntitySQLModelOptions";
import Entity from "../../../entity/Entity";

interface IEntitySQLModel {
    options: IEntitySQLModelOptions;
    entity: Entity;
    table: string;
    get(id: string | number, callback);
    getAsync(id: string | number): Promise<Entity>;
    getEntityClassesNext(classes: [Entity], models: any);
    init();
}

export default IEntitySQLModel;
