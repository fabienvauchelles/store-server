'use strict';

const
    express = require('express');

const
    storeController = require('./store.controller');



const router = express.Router({mergeParams: true});


/* CRUD */

// GET /:store/:id
router.get(
    '/:store/:id',
    storeController.getData
);

// POST /:store/:id
router.post(
    '/:store/:id',
    storeController.store
);



////////////

module.exports = router;
