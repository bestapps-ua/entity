import Entity from "./entity";

class List extends Entity {
    private _items: Array<Entity> = [];
    private _pager: { pages: number; limit: number; page: number };

    constructor(props) {
        super(props);
        this._items = props.items;
        this._pager = props.pager;
    }

    get pager(): { pages: number; limit: number; page: number } {
        return this._pager;
    }

    set pager(value: { pages: number; limit: number; page: number }) {
        this._pager = value;
    }

    get items(): Array<any> {
        return this._items;
    }

    set items(value: Array<any>) {
        this._items = value;
    }

}

export default List;
