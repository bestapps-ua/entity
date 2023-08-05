import ICacheFactoryModel from "../cache/ICacheFactoryModel";

interface IEntityCacheOptions {
    can: {
        store: boolean;
        fetch: boolean;
    };
    ttl: number;
    model: ICacheFactoryModel;
}

export default IEntityCacheOptions;
