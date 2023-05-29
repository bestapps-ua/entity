"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EntitySQLModel_1 = __importDefault(require("../../src/model/entity/EntitySQLModel"));
const Main_1 = __importDefault(require("../entity/Main"));
let options = {
    table: 'main',
    entity: Main_1.default,
    schemas: [
        {
            field: 'parent',
            source: {
                id: 'pid',
                model: 'this',
            },
            isLazy: true,
            optional: true,
        },
        {
            field: 'name'
        },
        {
            field: 'data',
            type: 'json',
        },
    ]
};
class MainModel extends EntitySQLModel_1.default {
}
exports.default = new MainModel(options);
//# sourceMappingURL=MainModel.js.map