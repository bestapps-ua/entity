import ICacheOptions from "./ICacheOptions";
import ICacheEntity from "./ICacheEntity";

interface ICacheModel {
    fetch?(id: number|string, options: ICacheOptions);
    set?(id: number|string, data: ICacheEntity, options: ICacheOptions);
    invalidateAll?();
    invalidate?(id: number|string);
    disconnect?();
    encode(data: ICacheEntity, options: ICacheOptions);
    decode(serialized: string, options: ICacheOptions);
}

export default ICacheModel;
