'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express').Router();

const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/asset', ctrl.getUrl)
  .post('/asset', upload.single('file'), ctrl.upload);

module.exports = { router };
