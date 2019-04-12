'use strict';

const ctrl = require('./storage.controller');
const multer = require('multer');
const passport = require('passport');
const router = require('express-promise-router')();

const auth = (...args) => passport.authenticate(...args);
const upload = multer({ storage: multer.memoryStorage() });

router
  .get('/asset', auth('jwt'), ctrl.getPublicUrl)
  .post('/asset', upload.single('file'), auth('jwt'), (req, res) => {
    if (req.file) return ctrl.upload(req, res);
    return ctrl.resolveUrl(req, res);
  });

module.exports = { router };
