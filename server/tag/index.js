import { authorize } from '../shared/auth/mw.js';
import { createError } from '../shared/error/helpers.js';
import ctrl from './tag.controller.js';
import db from '../shared/database/index.js';
import express from 'express';
import { NOT_FOUND } from 'http-status-codes';
import roleConfig from '../../config/shared/role.js';

const router = express.Router();
const { Tag } = db;
const { user: role } = roleConfig;

const authorizeUser = authorize(role.INTEGRATION);

router
  .get('/', ctrl.list)
  .post('/', authorizeUser, ctrl.create);

router
  .param('tagId', getTag)
  .use('/:tagId', authorizeUser);

router.route('/:tagId')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

function getTag(req, _res, next, tagId) {
  return Tag
    .findByPk(tagId, { paranoid: false })
    .then(tag => tag || createError(NOT_FOUND, 'Tag not found'))
    .then(tag => {
      req.tag = tag;
      next();
    });
}

export default {
  path: '/tags',
  router
};
