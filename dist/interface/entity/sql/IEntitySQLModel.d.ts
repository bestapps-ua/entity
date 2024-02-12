import IEntitySQLModelOptions from "./IEntitySQLModelOptions";
import Entity from "../../../entity/Entity";
interface IEntitySQLModel {
    options: IEntitySQLModelOptions;
    entity: Entity;
    table: string;
    get(id: string | number, callback: any): any;
    getAsync(id: string | number): Promise<Entity>;
    getEntityClassesNext(classes: [Entity], models: any): any;
    init(): any;
}
export default IEntitySQLModel;
//# sourceMappingURL=IEntitySQLModel.d.ts.map