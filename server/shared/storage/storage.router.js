'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();
const { setSignedCookies } = require('./proxy/mw');
const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/set-cookies', setSignedCookies)
  .post('/', upload.single('file'), ctrl.upload);

module.exports = {
  path: '/assets',
  router
};
