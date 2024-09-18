import Entity from "../../entity/Entity";
import IEntitySQLModelOptions from "../../interface/entity/sql/IEntitySQLModelOptions";
import IEntitySQLModel from "../../interface/entity/sql/IEntitySQLModel";
import IEntityItemsParams from "../../interface/entity/items/IEntityItemsParams";
import IEntityItemsWhere from "../../interface/entity/items/IEntityItemsWhere";
import IEntityItemsCountParams from "../../interface/entity/items/IEntityItemsCountParams";
import EntityBaseSQLModel from "./EntityBaseSQLModel";
import IEntitySQLMakeScheme from "../../interface/entity/sql/IEntitySQLMakeScheme";
import IEntityResponse from "../../interface/entity/IEntityResponse";
import IEntitySQLMakeResponse from "../../interface/entity/sql/make/IEntitySQLMakeResponse";
import IEntitySQLMakeListResponse from "../../interface/entity/sql/make/IEntitySQLMakeListResponse";
declare class EntitySQLModel extends EntityBaseSQLModel implements IEntitySQLModel {
    options: IEntitySQLModelOptions;
    protected _table: string;
    private _sql;
    protected specialFields: {
        uid: {
            name: string;
            isFound: boolean;
        };
        created: {
            name: string;
            isFound: boolean;
        };
    };
    constructor(options: IEntitySQLModelOptions);
    init(): void;
    private _fillDefault;
    private autoFindFields;
    get table(): string;
    get tableEscaped(): string;
    set table(value: string);
    get sql(): any;
    set sql(value: any);
    get schemas(): IEntitySQLMakeScheme[];
    get(id: string | number, callback: IEntityResponse): void;
    getAsync(id: string | number): Promise<Entity>;
    make(data: any, callback: IEntitySQLMakeResponse): any;
    getByUid(uid: string, callback: any): void;
    getByUidAsync(uid: string): Promise<Entity>;
    /**
     * @param data
     */
    makeAsync(data: any): Promise<object>;
    makeList(err: any, rows: any, callback: IEntitySQLMakeListResponse): any;
    makeListAsync(err: any, rows: any): Promise<Entity[]>;
    makeListOnly(err: any, rows: any, callback: IEntitySQLMakeListResponse): any;
    makeListOnlyAsync(err: any, rows: any): Promise<Entity[]>;
    getOneByParams(params: IEntityItemsWhere | IEntityItemsWhere[], callback: IEntityResponse): void;
    getOneByParamsAsync(params: IEntityItemsWhere | IEntityItemsWhere[]): Promise<Entity>;
    getAllByParams(params: IEntityItemsWhere | IEntityItemsWhere[], callback: IEntitySQLMakeListResponse): void;
    getAllByParamsAsync(params: IEntityItemsWhere | IEntityItemsWhere[]): Promise<Entity[]>;
    /**
     * @param params
     * @param callback
     */
    getItems(params: IEntityItemsParams, callback: IEntitySQLMakeListResponse): void;
    getItemsAsync(params: IEntityItemsParams, options?: any): Promise<Entity[] | any[]>;
    /**
     * @param params
     * @param callback
     */
    getItemsCount(params: IEntityItemsCountParams, callback: any): void;
    getItemsCountAsync(params: IEntityItemsCountParams): Promise<number>;
    remove(item: Entity, callback: any): void;
    removeAsync(item: Entity): Promise<unknown>;
    truncate(): Promise<unknown>;
    getEntityClassesInvolved(): (typeof Entity | typeof import("../../entity/CacheEntity").default)[];
    getEntityClassesNext(classes: any, models: any): void;
    createAsync(entity: Entity): Promise<Entity>;
    create(entity: Entity, callback: any): void;
    protected beforeCreate(entity: Entity, field: string, value: any): Promise<any>;
    /**
     *
     * @param entity
     * @param callback
     */
    generateUid(entity: Entity, callback: any): void;
    generateUidAsync(entity: Entity): Promise<Entity>;
    normalizeUid(uid: string): string;
    findFieldSchema(id: string): IEntitySQLMakeScheme;
    updateAsync(entity: Entity): Promise<Entity>;
    update(entity: Entity, callback: any): void;
    updateJsonFieldAsync(entity: Entity, fieldName: string): Promise<Entity>;
    updateJsonField(entity: Entity, fieldName: string, callback: Function): void;
}
export default EntitySQLModel;
//# sourceMappingURL=EntitySQLModel.d.ts.map