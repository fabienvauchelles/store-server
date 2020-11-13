'use strict';

const
    bodyParser = require('body-parser'),
    express = require('express'),
    morgan = require('morgan'),
    winston = require('winston'),
    {WrongParameterError} = require('./common/exceptions'),
    {HttpError} = require('./common/controller');

const
    config = require('./config');



const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json({limit: '5mb'}));

app.use('/api', require('./api/store'), errorHandlingMiddleware);

app.listen(config.server.port, (err) => {
    if (err) {
        winston.error('Cannot start server:', err);
        return;
    }

    winston.info('API listening on port', config.server.port);
});



////////////

function errorHandlingMiddleware(err, req, res, next) {
    if (!err) {
        return next();
    }

    if (err instanceof WrongParameterError) {
        winston.error(err.message);

        return res.status(400).send(err.message);
    }

    if (err instanceof HttpError) {
        winston.error(err.serverMessage);

        return err.sendError(res);
    }

    winston.error(err);

    return res.status(500).send(err.message);
}