import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheEntity from "../../interface/cache/ICacheEntity";
import CacheEntity from "../../entity/CacheEntity";
import ICacheRedisModelOptions from "../../interface/cache/ICacheRedisModelOptions";
import CacheBaseModel from "./CacheBaseModel";
declare class CacheRedisModel extends CacheBaseModel {
    private _client;
    constructor(options: ICacheRedisModelOptions);
    get client(): any;
    initRedisClient(): void;
    fetch(id: number | string, options: ICacheOptions): Promise<CacheEntity>;
    /**
     *
     * @param id
     * @param data
     * @param options
     */
    set(id: number | string, data: ICacheEntity, options: ICacheOptions): Promise<void>;
    invalidateAll(): Promise<void>;
    invalidate(id: number | string): Promise<void>;
    disconnect(): Promise<void>;
}
export default CacheRedisModel;
//# sourceMappingURL=CacheRedisModel.d.ts.map