'use strict';

const ctrl = require('./tag.controller');
const router = require('express').Router();

router
  .get('/', ctrl.list);

module.exports = {
  path: '/tags',
  router
};
