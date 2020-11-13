'use strict';

const
    _ = require('lodash'),
    {MongoClient} = require('mongodb'),
    {WrongParameterError} = require('../../common/exceptions'),
    winston = require('winston');

const
    config = require('../../config');



class StoreError extends Error {
    constructor(message, id) {
        super(message);

        this.id = id;
    }
}



class StoreNotFoundError extends StoreError {
    constructor(id) {
        super(`Store ${id} not found`, id);
    }
}



class StoreNoModificationError extends StoreError {
    constructor(id) {
        super(`Cannot modify ${id}`, id);
    }
}



class StoreController {

    constructor() {
        this._client = new MongoClient(config.database.uri, {useUnifiedTopology: true});

        this._client
            .connect()
            .then(() => {
                this._database = this._client.db(config.database.dbname);

                winston.info('Connected to database.');
            })
            .catch((err) => {
                winston.error('Login error:', err);
            })
        ;
    }


    async store(storeName, id, data) {
        if (!storeName || storeName.length <= 0) {
            throw new WrongParameterError('storeName');
        }

        if (!id || id.length <= 0) {
            throw new WrongParameterError('id');
        }

        if (!data || !_.isObject(data)) {
            throw new WrongParameterError('data');
        }

        winston.debug('[StoreController] store(): storeName=', storeName, '/ id=', id);

        const col = this._database.collection(storeName);

        const res = await col.updateOne(
            {_id: id},
            {$set: data},
            {upsert: true}
        );

        if (res.result.n !== 1) {
            throw new StoreNoModificationError(id);
        }
    }


    async getData(storeName, id) {
        if (!storeName || storeName.length <= 0) {
            throw new WrongParameterError('storeName');
        }

        if (!id || id.length <= 0) {
            throw new WrongParameterError('id');
        }

        winston.debug('[StoreController] getData(): storeName=', storeName, '/ id=', id);

        const col = this._database.collection(storeName);

        const data = await col.findOne(
            {_id: id}
        );

        if (!data) {
            throw new StoreNotFoundError(id);
        }

        return data;
    }
}



////////////

module.exports = {
    storeController: new StoreController(),
    StoreError,
    StoreNotFoundError,
    StoreNoModificationError,
};
