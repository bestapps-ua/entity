import Entity from "../../src/entity/Entity";

class Main extends Entity {

    private _name: string;
    private _parent: Main;
    private _data: any;

    constructor(data) {
        super(data);
        this._name = data.name;
        this._parent = data.parent;
        this._data = data.data;
    }

    get data(): any {
        return this._get('_data');
    }

    set data(value: any) {
        this._data = value;
    }
    get parent(): Main {
        return this._get('_parent');
    }

    set parent(value: Main) {
        this._parent = value;
    }
    get name(): string {
        return this._get('_name');
    }

    set name(value: string) {
        this._name = value;
    }
}

export default Main;
