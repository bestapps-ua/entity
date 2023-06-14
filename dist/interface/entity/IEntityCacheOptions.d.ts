import ICacheFactoryModel from "../cache/ICacheFactoryModel";
export interface IEntityCacheOptions {
    can: {
        store: boolean;
        fetch: boolean;
    };
    ttl: number;
    model: ICacheFactoryModel;
}
//# sourceMappingURL=IEntityCacheOptions.d.ts.map