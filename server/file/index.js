const ctrl = require('./file.controller');
const router = require('express-promise-router')();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/files', ctrl.getDownloadUrl)
  .post('/files', upload.single('file'), ctrl.uploadFile);

module.exports = { router };
