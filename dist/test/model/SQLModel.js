'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RegistryModel_1 = __importDefault(require("../../src/model/RegistryModel"));
let config = require('config');
/**
 * type {Wap3LibSQL}
 */
let Wap3LibSQL = require('@bestapps/raks-sql').Wap3LibSQL;
let sql = new Wap3LibSQL({
    showLog: false,
    db: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
    }
});
RegistryModel_1.default.set('sql', sql);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield new Promise((resolve) => {
        sql.connect(() => {
            resolve();
        });
    });
}))();
exports.default = sql;
//# sourceMappingURL=SQLModel.js.map