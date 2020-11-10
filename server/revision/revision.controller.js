'use strict';

const { Revision, Sequelize, User } = require('../shared/database');
const { resolveStatics } = require('../shared/storage/helpers');

const { Op } = Sequelize;

function index({ repository, query }, res) {
  const {
    limit, offset, last,
    entity, entityId, entityIds, activityId, createdBefore
  } = query;
  const where = {
    repositoryId: repository.id,
    ...entity && { entity },
    ...createdBefore && {
      createdAt: { [Op.lt]: createdBefore }
    },
    state: {
      ...activityId && { activityId },
      ...entityId && { id: entityId },
      ...!entityId && entityIds && { id: { [Op.in]: entityIds } }
    }
  };
  const include = [{
    model: User,
    paranoid: false,
    attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'label']
  }];
  const opts = {
    where,
    include,
    order: [['createdAt', 'DESC']],
    limit,
    offset
  };
  return Revision
    .scope(last && 'lastByEntity')
    .findAll(opts)
    .then(data => res.json({ data }));
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
