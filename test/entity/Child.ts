import Entity from "../../src/entity/Entity";
import Main from "./Main";

class Child extends Entity {

    private _name: string;
    private _main: Main;

    constructor(data) {
        super(data);
        this._name = data.name;
        this._main = data.main;
    }

    get name(): string {
        return this._get('_name');
    }

    set name(value: string) {
        this._name = value;
    }

    get main(): Main {
        return this._get('_main');
    }

    set main(value: Main) {
        this._main = value;
    }

}

export default Child;
