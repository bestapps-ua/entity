import Entity from "../../src/entity/Entity";

class Special extends Entity {


    private _name: string;
    private _guid: string;
    private _ct: number;

    constructor(props) {
        super(props);
        this._guid = props.guid;
        this._ct = props.ct;
        this._name = props.name;
    }

    get name(): string {
        return this._get('_name');
    }

    set name(value: string) {
        this._name = value;
    }

    get ct(): number {
        return this._ct;
    }

    set ct(value: number) {
        this._ct = value;
    }
    get guid(): string {
        return this._guid;
    }

    set guid(value: string) {
        this._guid = value;
    }
}

export default Special;
