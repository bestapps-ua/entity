import ICacheEntity from "../interface/cache/ICacheEntity";
import Entity from "./Entity";

class CacheEntity implements ICacheEntity {

    private _data: Entity;
    private _expires: number;
    private _created: number;
    private _ttl: number;

    constructor(data) {
        this._data = data.data;
        this._expires = data.expires;
        this._ttl = data.ttl;
        this._created = Date.now() / 1000;
    }

    get expires(): number {
        return this._expires;
    }

    set expires(value: number) {
        this._expires = value;
    }
    get data(): Entity {
        return this._data;
    }

    set data(value: Entity) {
        this._data = value;
    }

    get created(): number {
        return this._created;
    }

    set created(value: number) {
        this._created = value;
    }

    get ttl(){
        return this._ttl;
    }
}

export default CacheEntity;
