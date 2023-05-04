'use strict';

let config = require('config');

/**
 * type {Wap3LibSQL}
 */
let Wap3LibSQL = require('@bestapps/raks-sql').Wap3LibSQL;

export default new Wap3LibSQL({
    showLog: true,
    db: {
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name
    }
});
