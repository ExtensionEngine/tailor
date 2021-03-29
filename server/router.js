'use strict';

const { auth: authConfig } = require('../config/server');
const { authenticate } = require('./shared/auth');
const createStorageRouter = require('./shared/storage/storage.router');
const express = require('express');
const { extractAuthData } = require('./shared/auth/mw');
const repository = require('./repository');
const serviceProvider = require('./shared/serviceProvider');
const tag = require('./tag');
const user = require('./user');

const router = express.Router();
const storage = serviceProvider.get('storage');
const storageRouter = createStorageRouter(storage);
router.use(processBody);
router.use(extractAuthData);

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
router.use(storageRouter.path, storageRouter.router);
router.use(tag.path, tag.router);

module.exports = router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
