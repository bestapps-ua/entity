"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntitySQLModel_1 = __importDefault(require("../../src/model/entity/EntitySQLModel"));
const MainModel_1 = __importDefault(require("./MainModel"));
const Child_1 = __importDefault(require("../entity/Child"));
let options = {
    table: 'main',
    entity: Child_1.default,
    schemas: [
        {
            field: 'main',
            source: {
                id: 'main_id',
                model: MainModel_1.default,
            },
            isLazy: true,
        },
        {
            field: 'name'
        },
    ]
};
class ChildModel extends EntitySQLModel_1.default {
}
exports.default = new ChildModel(options);
//# sourceMappingURL=ChildModel.js.map