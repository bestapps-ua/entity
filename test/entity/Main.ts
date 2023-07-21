import Entity from "../../src/entity/Entity";
import Special from "./Special";

class Main extends Entity {

    private _name: string;
    private _parent: Main;
    private _data: any;
    private _special: Special;

    constructor(props) {
        super(props);
        this._name = props.name;
        this._parent = props.parent;
        this._special = props.special;
        this._data = props.data;
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

    get special(): Special {
        return this._get('_special');
    }

    set special(value: Special) {
        this._special = value;
    }

}

export default Main;
