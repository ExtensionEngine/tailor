'use-strict';

const express = require('express');
const controller = require('./asset.controller').controller;

const router = express.Router();

router.get('/assets/', controller.list);
router.get('/assets/:assetKey', controller.show);
router.post('/assets/', controller.create);
router.patch('/assets/:assetKey', controller.patch);
router.put('/assets/:assetKey', controller.replace);
router.delete('/assets/:assetKey', controller.remove);

module.exports = {
  router
};
