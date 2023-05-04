class Entity {

    private _data: any;
    private _id: number;
    private _created: number;
    private _uid: string;

    constructor(data) {
        this._data = data;
        this._id = data.id;
        this._uid = data.uid;
        this._created = data.created;
    }

    /**
     * For lazy load please use this method
     * @param property
     * @private
     */
    protected _get(property){
        if(typeof this[property] === 'function') {
            return this[property]();
        }
        return this[property];
    }

    get data(){
        return this._data;
    }

    get id(){
        return this._get('_id');
    }

    get created(){
        return this._get('_created');
    }

    getClassName(){
        return this.constructor.name.toLowerCase();
    }

    get allData(){
        let properties = Object.getOwnPropertyNames(this);
        let data = {};
        for(let i = 0; i < properties.length; i++){
            let property = properties[i];
            property = property.substring(1);

            if(this[properties[i]] instanceof Entity) {
                //console.log(this[properties[i]].allData);
                data[property] = this[properties[i]].allData;
            }else {
                data[property] = (async () => {
                    await this[properties[i]];
                });
            }
        }
        return data;
    }

    get uid(): string {
        return this._get('_uid');
    }

    set uid(value: string) {
        this._uid = value;
    }

}

export default Entity;
