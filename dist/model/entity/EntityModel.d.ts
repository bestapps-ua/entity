import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import Entity from "../../entity/Entity";
declare class EntityModel {
    protected options: IEntityModelOptions;
    protected _entity: Entity;
    constructor(options: IEntityModelOptions);
    get entity(): Entity;
    set entity(value: Entity);
    get(id: any, callback: any): any;
}
export default EntityModel;
//# sourceMappingURL=EntityModel.d.ts.map