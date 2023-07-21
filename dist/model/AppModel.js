"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GlobalEventModel_1 = __importDefault(require("./event/GlobalEventModel"));
const Events_1 = require("./event/Events");
const RegistryModel_1 = __importDefault(require("./RegistryModel"));
const STATUS_LOADING = 'loading';
const STATUS_LOADED = 'loaded';
class AppModel {
    constructor() {
    }
    init() {
        GlobalEventModel_1.default.getEmitter().on(Events_1.EVENT_SQL_MODEL_LOADING, ({ model }) => {
            let appModels = this.getAppModels();
            appModels[model.table] = STATUS_LOADING;
            RegistryModel_1.default.set('appModels', appModels);
        });
        GlobalEventModel_1.default.getEmitter().on(Events_1.EVENT_SQL_MODEL_LOADED, ({ model }) => {
            let appModels = this.getAppModels();
            appModels[model.table] = STATUS_LOADED;
            RegistryModel_1.default.set('appModels', appModels);
            for (const key in appModels) {
                if (appModels[key] === STATUS_LOADING)
                    return;
            }
            GlobalEventModel_1.default.getEmitter().emit(Events_1.EVENT_SQL_MODELS_LOADED, { models: appModels });
        });
    }
    getAppModels() {
        let appModels = RegistryModel_1.default.get('appModels') || {};
        return appModels;
    }
}
exports.default = new AppModel();
//# sourceMappingURL=AppModel.js.map