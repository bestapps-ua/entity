let models = new Map();

export default class RegistryModel {
    static set(key: string, value: any) {
        models.set(key, value);
    }

    static get(key: string){
        return models.get(key);
    }

    static keys(){
        return models.keys();
    }
}
