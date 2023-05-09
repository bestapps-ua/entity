import IEntityModelOptions from "../../interface/entity/IEntityModelOptions";
import Entity from "../../entity/Entity";
import CacheEntity from "../../entity/CacheEntity";

class EntityModel {
    protected options: IEntityModelOptions;
    protected _entity: Entity;

    constructor(options: IEntityModelOptions) {
        this.entity = options.entity;
        this.options = options;
    }

    get entity() {
        if (!this._entity) throw 'Please set entity in options';
        return this._entity;
    }

    set entity(value) {
        this._entity = value;
    }

    get(id, callback) {
        return callback && callback();
    }

}

export default EntityModel;
