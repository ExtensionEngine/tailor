import { authorizeIntegration } from '../shared/auth/mw.js';
import { createError } from '../shared/error/helpers.js';
import ctrl from './tag.controller.js';
import db from '../shared/database/index.js';
import express from 'express';
import { NOT_FOUND } from 'http-status-codes';

const router = express.Router();
const { Tag } = db;

router
  .get('/', ctrl.list)
  .post('/', authorizeIntegration, ctrl.create);

router
  .param('tagId', getTag)
  .use('/:tagId', authorizeIntegration);

router.route('/:tagId')
  .get(ctrl.get)
  .patch(ctrl.patch)
  .delete(ctrl.remove);

function getTag(req, _res, next, tagId) {
  return Tag
    .findByPk(tagId)
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
