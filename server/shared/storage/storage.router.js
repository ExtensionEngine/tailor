'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

function createRouter(storage) {
  return router
    .get('/', ctrl.getUrl(storage))
    .post('/', upload.single('file'), ctrl.upload(storage));
}

module.exports = storage => ({
  path: '/assets',
  router: createRouter(storage)
});
