'use strict';

const
    {
        Controller,
        ResourceNotFoundError,
        ServerError,
    } = require('../../common/controller'),
    {
        storeController,
        StoreNotFoundError,
        StoreNoModificationError,
    } = require('../../model/store/store.controller');


class StoreController extends Controller {

    constructor() {
        super();
    }


    async store(req, res) {
        const
            storeName = req.params.store,
            id = req.params.id,
            data = req.body;

        try {
            await storeController.store(storeName, id, data);

            this.sendNoData(res);
        }
        catch (err) {
            if (err instanceof StoreNoModificationError) {
                throw new ServerError(err.message);
            }

            throw err;
        }
    }


    async getData(req, res) {
        const
            storeName = req.params.store,
            id = req.params.id;

        try {
            const data = await storeController.getData(storeName, id);

            this.sendData(res, data);
        }
        catch (err) {
            if (err instanceof StoreNotFoundError) {
                throw new ResourceNotFoundError(err.message);
            }

            throw err;
        }
    }
}


////////////

module.exports = new StoreController();
