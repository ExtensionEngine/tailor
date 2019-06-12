'use strict';

const { Activity, Revision, TeachingElement, User } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { resolveStatics } = require('../shared/storage/helpers');

function index({ course, query }, res) {
  const { limit, offset, entity, entityId } = query;
  const where = { courseId: course.id };
  if (entity) {
    where.entity = entity;
    where.state = { id: entityId };
  }
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const opts = { where, include, order: [['createdAt', 'DESC']], limit, offset };
  return Revision.findAll(opts).then(data => res.json({ data }));
}

function restore({ body: { state, entity }, user }, res) {
  const opts = { recursive: true, restore: true, context: { userId: user.id } };
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const action = entity === 'ACTIVITY' ? restoreActivity : restoreTe;
  return action(state.id, opts, include)
    .then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

function restoreActivity(id, opts, include) {
  const revisionOpts = { include, order: [[ 'createdAt', 'DESC' ]] };
  return Activity.findByPk(id, { paranoid: false })
      .then(activity => activity || createError(NOT_FOUND))
      .then(activity => activity.removeOrRestore(opts))
      .then(() => Revision.findOne(revisionOpts));
}

function restoreTe(id, opts, include) {
  const revisionOpts = { include, order: [[ 'createdAt', 'DESC' ]] };
  return TeachingElement.findByPk(id, { paranoid: false })
    .then(teachingElement => teachingElement || createError(NOT_FOUND))
    .then(teachingElement => teachingElement.restore(opts))
    .then(() => Revision.findOne(revisionOpts));
}

module.exports = {
  index,
  resolve,
  restore
};
