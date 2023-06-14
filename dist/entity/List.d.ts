import Entity from "./Entity";
declare class List extends Entity {
    private _items;
    private _pager;
    constructor(props: any);
    get pager(): {
        pages: number;
        limit: number;
        page: number;
    };
    set pager(value: {
        pages: number;
        limit: number;
        page: number;
    });
    get items(): Array<any>;
    set items(value: Array<any>);
}
export default List;
//# sourceMappingURL=List.d.ts.map