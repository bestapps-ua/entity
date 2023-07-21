import globalEventModel from "./event/GlobalEventModel";
import {EVENT_SQL_MODEL_LOADED, EVENT_SQL_MODEL_LOADING, EVENT_SQL_MODELS_LOADED} from "./event/Events";
import RegistryModel from "./RegistryModel";

const STATUS_LOADING = 'loading';
const STATUS_LOADED = 'loaded';
class AppModel {
    constructor() {
    }

    init(){
        globalEventModel.getEmitter().on(EVENT_SQL_MODEL_LOADING, ({model}) => {
            let appModels = this.getAppModels();
            appModels[model.table] = STATUS_LOADING;
            RegistryModel.set('appModels', appModels);
        });

        globalEventModel.getEmitter().on(EVENT_SQL_MODEL_LOADED, ({model}) => {
            let appModels = this.getAppModels();
            appModels[model.table] = STATUS_LOADED;
            RegistryModel.set('appModels', appModels);
            for (const key in appModels) {
                if(appModels[key] === STATUS_LOADING) return ;
            }
            globalEventModel.getEmitter().emit(EVENT_SQL_MODELS_LOADED, {models: appModels});
        });
    }

    getAppModels(){
        let appModels = RegistryModel.get('appModels') || {};
        return appModels;
    }

}
export default new AppModel();
