const ctrl = require('./upload.controller');
const router = require('express-promise-router')();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router
  .post('/files', upload.single('file'), ctrl.uploadFile);

module.exports = { router };
