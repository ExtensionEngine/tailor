import { auth as authConfig } from '../config/server/index.js';
import authenticator from './shared/auth/index.js';
import express from 'express';
import { extractAuthData } from './shared/auth/mw.js';
import repository from './repository/index.js';
import tag from './tag/index.js';
import user from './user/index.js';

const { authenticate } = authenticator;
const router = express.Router();
router.use(processBody);
router.use(extractAuthData);

// Public routes:
router.use(user.path, user.router);

// SSO routes:
authConfig.oidc.enabled && (() => {
  const oidc = import('./oidc');
  router.use(oidc.path, oidc.router);
})();

// Protected routes:
router.use(authenticate('jwt'));
router.use(repository.path, repository.router);
router.use(tag.path, tag.router);

export default router;

function processBody(req, _res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
