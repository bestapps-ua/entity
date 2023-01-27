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

    get data(){
        return this._data;
    }

    get id(){
        return this._id;
    }

    get created(){
        return this._created;
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
                data[property] = this[properties[i]];
            }
        }
        return data;
    }

    get uid(): string {
        return this._uid;
    }

    set uid(value: string) {
        this._uid = value;
    }

}

export default Entity;
