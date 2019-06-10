'use strict';

const { Activity, Revision, TeachingElement, User } = require('../shared/database');
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

function restore({ body: { revision }, user }, res) {
  const opts = { recursive: true, context: { userId: user.id } };
  const include = [{ model: User, attributes: ['id', 'email'] }];
  const where = { id: revision.id };
  const { id } = revision.state;
  Revision.update({ restored: true }, { where });
  if (revision.entity === 'ACTIVITY') return restoreActivity(id, opts, include, res);
  return restoreTe(id, opts, include, res);
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

function restoreActivity(id, opts, include, res) {
  return Activity.findByPk(id, { paranoid: false })
      .then(activity => activity.restoreActivity(opts))
      .then(() => {
        const options = { limit: 1, include, order: [[ 'createdAt', 'DESC' ]] };
        return Revision.findAll(options)
        .then(data => res.json({ data: data[0] }));
      });
}

function restoreTe(id, opts, include, res) {
  return TeachingElement.findByPk(id, { paranoid: false })
    .then(teachingElement => teachingElement.restore(opts))
    .then(() => {
      const options = { limit: 1, include, order: [[ 'createdAt', 'DESC' ]] };
      return Revision.findAll(options)
      .then(data => res.json({ data: data[0] }));
    });
}

module.exports = {
  index,
  resolve,
  restore
};
