import IEntityItemsWhere from "./IEntityItemsWhere";

interface IEntityItemsJoin {
    table: string;
    type: 'inner',
    on?: IEntityItemsWhere|IEntityItemsWhere[];
}

export default IEntityItemsJoin;
