import Entity from "./Entity";
import ICacheEntity from "../interface/cache/ICacheEntity";
declare class CacheEntity implements ICacheEntity {
    private _data;
    private _expires;
    private _created;
    private _ttl;
    constructor(data: any);
    get expires(): number;
    set expires(value: number);
    get data(): Entity;
    set data(value: Entity);
    get created(): number;
    set created(value: number);
    get ttl(): number;
}
export default CacheEntity;
//# sourceMappingURL=CacheEntity.d.ts.map