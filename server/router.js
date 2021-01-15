'use strict';

const { auth: authConfig } = require('../config/server');
const { authenticate } = require('./shared/auth');
const express = require('express');
const { extractAuthStrategy } = require('./shared/auth/mw');
const repository = require('./repository');
const storage = require('./shared/storage/storage.router');
const tag = require('./tag');
const user = require('./user');

const router = express.Router();
router.use(processBody);
router.use(extractAuthStrategy);

// Public routes:
router.use(user.path, user.router);

// SSO routes:
authConfig.oidc.enabled && (() => {
  const oidc = require('./oidc');
  router.use(oidc.path, oidc.router);
})();

// Protected routes:
router.use(authenticate('jwt'));
router.use(repository.path, repository.router);
router.use(storage.path, storage.router);
router.use(tag.path, tag.router);

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
