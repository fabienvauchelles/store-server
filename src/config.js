'use strict';

const
    winston = require('winston');



require('dotenv').config();

const ENV = process.env;

if (['development', 'test'].includes(ENV.NODE_ENV)) {
    winston.level = 'debug';
}

module.exports = {
    node_env: ENV.NODE_ENV || 'development',


    server: {
        port: parseInt(ENV.SERVER_PORT || '3001'),
    },


    database: {
        uri: ENV.DATABASE_URI,
        dbname: ENV.DATABASE_DBNAME,
    },
};
