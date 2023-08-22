class Entity {

    protected _props: any;
    protected _id: number;
    protected _created: number;
    protected _uid: string;
    protected _system: any;

    public ignoredProperties = [];

    constructor(props) {
        this._props = props;
        this._id = props.id;
        this._uid = props.uid;
        this._created = props.created;
        this._system = props.system;
    }

    /**
     * For lazy load please use this method
     * @param property
     * @private
     */
    protected _get(property) {
        if (typeof this[property] === 'function') {
            return this[property]()();
        }
        return this[property];
    }

    get props() {
        return this._props;
    }

    get id() {
        return this._get('_id');
    }

    get created() {
        return this._get('_created');
    }

    getClassName() {
        let name = this.constructor.name;
        name = name.charAt(0).toLowerCase() + name.slice(1);
        return name;
    }

    get allData() {
        let properties = Object.getOwnPropertyNames(this);
        let data = {};
        (async () => {
            for (let i = 0; i < properties.length; i++) {
                let property = properties[i];
                property = property.substring(1);

                if (this[properties[i]] instanceof Entity) {
                    data[property] = this[properties[i]].allData;
                } else {
                    data[property] = await this[properties[i]];
                }
            }
        })();
        return data;
    }

    get uid(): string {
        return this._get('_uid');
    }

    set uid(value: string) {
        this._uid = value;
    }

    async getModifiedProperties() {
        let modified = [];
        for (const property in this.props) {
            if (!this.ignoredProperties.includes(property) && this.props[property] !== this[property]) {
                modified.push(property);
            }
        }
        return modified;
    }

    get system(): any {
        return this._system;
    }

    set system(value: any) {
        this._system = value;
    }
}

export default Entity;
