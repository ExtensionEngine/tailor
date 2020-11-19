'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/', ctrl.getUrl)
  .post('/', upload.single('file'), ctrl.upload)
  .post('/scorm', upload.single('file'), ctrl.uploadScormPackage);

module.exports = {
  path: '/assets',
  router
};
