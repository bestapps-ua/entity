import ICacheOptions from "./ICacheOptions";
import ICacheEntity from "./ICacheEntity";
interface ICacheModel {
    fetch?(id: number | string, options: ICacheOptions): any;
    set?(id: number | string, data: ICacheEntity, options: ICacheOptions): any;
    invalidateAll?(): any;
    invalidate?(id: number | string): any;
    disconnect?(): any;
    encode(data: ICacheEntity, options: ICacheOptions): any;
    decode(serialized: string, options: ICacheOptions): any;
}
export default ICacheModel;
//# sourceMappingURL=ICacheModel.d.ts.map