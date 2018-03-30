'use strict';

const { resolveStatics } = require('../shared/storage/helpers');
const { Revision, User } = require('../shared/database');

function index({ course, query }, res) {
  const { limit, offset, entityId } = query;
  let where = { courseId: course.id };
  if (entityId) where.state = { id: entityId };
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const opts = { where, include, order: [['createdAt', 'DESC']], limit, offset };
  return Revision.findAll(opts).then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

module.exports = {
  index,
  resolve
};
