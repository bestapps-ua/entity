class Entity {

    protected _params: any;
    private _id: number;
    private _created: number;
    private _uid: string;

    constructor(params) {
        this._params = params;
        this._id = params.id;
        this._uid = params.uid;
        this._created = params.created;
    }

    /**
     * For lazy load please use this method
     * @param property
     * @private
     */
    protected _get(property) {
        if (typeof this[property] === 'function') {
            return this[property]();
        }
        return this[property];
    }

    get params() {
        return this._params;
    }

    get id() {
        return this._get('_id');
    }

    get created() {
        return this._get('_created');
    }

    getClassName() {
        return this.constructor.name.toLowerCase();
    }

    get allData() {
        let properties = Object.getOwnPropertyNames(this);
        let data = {};
        for (let i = 0; i < properties.length; i++) {
            let property = properties[i];
            property = property.substring(1);

            if (this[properties[i]] instanceof Entity) {
                data[property] = this[properties[i]].allData;
            } else {
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
