import { Activity } from '../shared/database/index.js';
import { createError } from '../shared/error/helpers.js';
import ctrl from './activity.controller.js';
import express from 'express';
import { NOT_FOUND } from 'http-status-codes';
import processListQuery from '../shared/util/processListQuery.js';

const router = express.Router();

const processQuery = processListQuery({ order: [['position']] });

router.param('activityId', getActivity);

router.route('/')
  .get(processQuery, ctrl.list)
  .post(ctrl.create);

router.route('/:activityId')
  .get(ctrl.show)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

router
  .post('/:activityId/reorder', ctrl.reorder)
  .post('/:activityId/clone', ctrl.clone)
  .post('/:activityId/status', ctrl.updateStatus)
  .get('/:activityId/publish', ctrl.publish)
  .get('/:activityId/preview', ctrl.getPreviewUrl);

function getActivity(req, _res, next, activityId) {
  return Activity.findByPk(activityId, { paranoid: false })
    .then(activity => activity || createError(NOT_FOUND, 'Activity not found'))
    .then(activity => {
      req.activity = activity;
      next();
    });
}

export default {
  path: '/activities',
  router
};
