'use strict';

const { Activity, Revision, TeachingElement, User } = require('../shared/database');
const { NOT_FOUND, CONFLICT } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const { resolveStatics } = require('../shared/storage/helpers');

const isRestored = instance => instance.isSoftDeleted() ? instance : createError(CONFLICT);

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
  const opts = { recursive: true, context: { userId: user.id } };
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const action = entity === 'ACTIVITY' ? restoreActivity : restoreTeachingElement;
  return action(state.id, opts)
    .then(() => Revision.findOne({ include, order: [[ 'createdAt', 'DESC' ]] }))
    .then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

function restoreActivity(id, opts) {
  return Activity.findByPk(id, { paranoid: false })
      .then(activity => activity || createError(NOT_FOUND))
      .then(activity => isRestored(activity))
      .then(activity => activity.removeOrRestore(opts));
}

function restoreTeachingElement(id, opts) {
  return TeachingElement.findByPk(id, { paranoid: false })
    .then(teachingElement => teachingElement || createError(NOT_FOUND))
    .then(teachingElement => isRestored(teachingElement))
    .then(teachingElement => teachingElement.restore(opts));
}

module.exports = {
  index,
  resolve,
  restore
};
