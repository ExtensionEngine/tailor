import { authenticate, logout } from '../shared/auth/index.js';
import { loginRequestLimiter, resetLoginAttempts, setLoginLimitKey } from './mw.js';
import { ACCEPTED } from 'http-status-codes';
import { authorize } from '../shared/auth/mw.js';
import ctrl from './user.controller.js';
import express from 'express';
import { processPagination } from '../shared/database/pagination.js';
import { requestLimiter } from '../shared/request/mw.js';
import { User } from '../shared/database/index.js';

const router = express.Router();

// Public routes:
router
  .post(
    '/login',
    setLoginLimitKey,
    loginRequestLimiter,
    authenticate('local', { setCookie: true }),
    resetLoginAttempts,
    ctrl.getProfile
  )
  .post('/forgot-password', ctrl.forgotPassword)
  .use('/reset-password', requestLimiter(), authenticate('token'))
  .post('/reset-password', ctrl.resetPassword)
  .post('/reset-password/token-status', (_, res) => res.sendStatus(ACCEPTED));

// Protected routes:
router
  .use(authenticate('jwt'))
  .get('/', authorize(), processPagination(User), ctrl.list)
  .post('/', authorize(), ctrl.upsert)
  .get('/logout', logout())
  .get('/me', ctrl.getProfile)
  .patch('/me', ctrl.updateProfile)
  .post('/me/change-password', ctrl.changePassword)
  .delete('/:id', authorize(), ctrl.remove)
  .post('/:id/reinvite', authorize(), ctrl.reinvite);

export default {
  path: '/users',
  router
};
