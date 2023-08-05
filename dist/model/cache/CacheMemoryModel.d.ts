import ICacheOptions from "../../interface/cache/ICacheOptions";
import CacheEntity from "../../entity/CacheEntity";
import ICacheModelOptions from "../../interface/cache/ICacheModelOptions";
import CacheBaseModel from "./CacheBaseModel";
import ICacheEntity from "../../interface/cache/ICacheEntity";
declare class CacheMemoryModel extends CacheBaseModel {
    constructor(options: ICacheModelOptions);
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
}
export default CacheMemoryModel;
//# sourceMappingURL=CacheMemoryModel.d.ts.map