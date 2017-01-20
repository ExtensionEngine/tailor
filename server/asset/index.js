'use strict';

const express = require('express');

const controller = require('./asset.controller').controller;
const io = require('../shared/io');
const model = require('./asset.model');

const router = express.Router();
const input = io.input();
const output = io.output();

router.get('/assets',
  input,
  controller.list,
  output
);

router.get('/assets/:assetKey',
  input,
  controller.show,
  output
);

router.post('/assets/',
  input,
  controller.create,
  output
);

router.patch('/assets/:assetKey',
  input,
  controller.patch,
  output
);

router.put('/assets/:assetKey',
  input,
  controller.replace,
  output
);

router.delete('/assets/:assetKey',
  input,
  controller.remove,
  output
);

module.exports = {
  controller,
  model,
  router
};
