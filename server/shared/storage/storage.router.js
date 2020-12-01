'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();
const staticRouter = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .post('/', upload.single('file'), ctrl.upload);
staticRouter
  .get('/*', ctrl.get);

module.exports = {
  path: '/assets',
  router,
  staticRouter
};
