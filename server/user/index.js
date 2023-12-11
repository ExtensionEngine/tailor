import { authorize, authorizeIntegration } from '../shared/auth/mw.js';
import { loginRequestLimiter, resetLoginAttempts, setLoginLimitKey } from './mw.js';
import { ACCEPTED } from 'http-status-codes';
import authService from '../shared/auth/index.js';
import ctrl from './user.controller.js';
import db from '../shared/database/index.js';
import express from 'express';
import { processPagination } from '../shared/database/pagination.js';
import { requestLimiter } from '../shared/request/mw.js';

const { User } = db;
const router = express.Router();

const {
  EXTERNAL_ACCESS_MANAGEMENT: isExternalAccessManagement
} = process.env;

const authorizeUser = isExternalAccessManagement
  ? authorizeIntegration
  : authorize();

// Public routes:
router
  .post(
    '/login',
    setLoginLimitKey,
    loginRequestLimiter,
    authService.authenticate('local', { setCookie: true }),
    resetLoginAttempts,
    ctrl.getProfile
  )
  .post('/forgot-password', ctrl.forgotPassword)
  .use('/reset-password', requestLimiter(), authService.authenticate('token'))
  .post('/reset-password', ctrl.resetPassword)
  .post('/reset-password/token-status', (_, res) => res.sendStatus(ACCEPTED));

// Protected routes:
router
  .use(authService.authenticate('jwt'))
  .get('/', authorizeUser, processPagination(User), ctrl.list)
  .post('/', authorizeUser, ctrl.upsert)
  .get('/logout', authService.logout())
  .get('/me', ctrl.getProfile)
  .patch('/me', ctrl.updateProfile)
  .post('/me/change-password', ctrl.changePassword)
  .delete('/:id', authorizeUser, ctrl.remove)
  .post('/:id/reinvite', authorizeUser, ctrl.reinvite)
  .post('/:id/tag', authorizeUser, ctrl.addTag)
  .delete('/:id/tag/:tagId', authorizeUser, ctrl.removeTag);

export default {
  path: '/users',
  router
};
