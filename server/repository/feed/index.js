import ctrl from './controller.js';
import express from 'express';
import { middleware as sse } from '../../shared/sse/index.js';

const router = express.Router();

router.get('/subscribe', sse, ctrl.subscribe);

router.route('/')
  .get(ctrl.fetchUserActivities)
  .post(ctrl.addUserActivity)
  .delete(ctrl.removeUserActivity);

export default {
  path: '/feed',
  router
};
