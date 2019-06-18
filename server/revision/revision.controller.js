'use strict';

const { Activity, Revision, TeachingElement, User } = require('../shared/database');
const { NOT_FOUND, CONFLICT } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const { resolveStatics } = require('../shared/storage/helpers');

const isRestored = instance => !instance.isSoftDeleted();

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
  const options = { context: { userId: user.id } };
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const action = entity === 'ACTIVITY' ? restoreActivity : restoreTeachingElement;
  return action(state.id, options)
    .then(() => Revision.findOne({ include, order: [[ 'createdAt', 'DESC' ]] }))
    .then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

function restoreActivity(id, options) {
  return Activity.findByPk(id, { paranoid: false })
    .tap(activity => activity || createError(NOT_FOUND))
    .tap(activity => isRestored(activity) && createError(CONFLICT))
    .then(activity => activity.removeOrRestore(options));
}

function restoreTeachingElement(id, options) {
  return TeachingElement.findByPk(id, { paranoid: false })
    .tap(teachingElement => teachingElement || createError(NOT_FOUND))
    .tap(teachingElement => isRestored(teachingElement) && createError(CONFLICT))
    .then(teachingElement => teachingElement.restore(options));
}

module.exports = {
  index,
  resolve,
  restore
};
