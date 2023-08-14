import IEntityItemsWhere from "./IEntityItemsWhere";

interface IEntityItemsJoin {
    table: string;
    type?: string;
    on?: IEntityItemsWhere|IEntityItemsWhere[];
}

export default IEntityItemsJoin;
