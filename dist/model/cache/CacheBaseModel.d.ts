import ICacheModel from "../../interface/cache/ICacheModel";
import ICacheModelOptions from "../../interface/cache/ICacheModelOptions";
import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheEntity from "../../interface/cache/ICacheEntity";
declare class CacheBaseModel implements ICacheModel {
    options: any;
    constructor(options: ICacheModelOptions);
    encode(data: ICacheEntity, options: ICacheOptions): any;
    decode(serialized: string, options: ICacheOptions): any;
}
export default CacheBaseModel;
//# sourceMappingURL=CacheBaseModel.d.ts.map