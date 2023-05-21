import ICacheModel from "../../interface/cache/ICacheModel";
import ICacheModelOptions from "../../interface/cache/ICacheModelOptions";
import ICacheOptions from "../../interface/cache/ICacheOptions";
import ICacheEntity from "../../interface/cache/ICacheEntity";

const ESSerializer = require('esserializer');

class CacheBaseModel implements ICacheModel {
    public options;

    constructor(options: ICacheModelOptions) {
        this.options = options;
    }

    encode(data: ICacheEntity, options: ICacheOptions) {
        ESSerializer.registerClasses(options.classes);
        return ESSerializer.serialize(data);
    }

    decode(serialized: string, options: ICacheOptions) {
        ESSerializer.registerClasses(options.classes);
        return ESSerializer.deserialize(serialized, options.classes);
    }
}

export default CacheBaseModel;
