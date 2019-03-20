'use strict';

const auth = require('passport').authenticate(['jwt', 'jwt:form']);
const bodyParser = require('body-parser');
const ctrl = require('./storage.controller');
const multer = require('multer');
const router = require('express-promise-router')();

const upload = multer({ storage: multer.memoryStorage() });

router
  .use(bodyParser.urlencoded())
  .use(auth)
  .get('/asset', ctrl.getUrl)
  .post('/asset', ctrl.resolveUrl)
  .post('/asset', upload.single('file'), ctrl.upload);

module.exports = { router };
