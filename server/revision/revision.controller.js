'use strict';

const { Activity, Revision, Sequelize, User } = require('../shared/database');
const { resolveStatics } = require('../shared/storage/helpers');

const { Op } = Sequelize;

function index({ repository, query }, res) {
  const { limit, offset, entity, entityId } = query;
  const where = { repositoryId: repository.id };
  if (entity) {
    where.entity = entity;
    where.state = { id: entityId };
  }
  const include = [{
    model: User,
    paranoid: false,
    attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'label']
  }];
  const opts = { where, include, order: [['createdAt', 'DESC']], limit, offset };
  return Revision.findAll(opts).then(data => res.json({ data }));
}

async function getStateByMoment({ repository, query }, res) {
  const { activityId, entity, entityIds = [], timestamp } = query;
  const repositoryId = repository.id;
  const activity = await Activity.findByPk(activityId);
  const { nodes } = await activity.descendants();
  const removes = await Revision.findAll({
    attributes: ['state'],
    where: {
      repositoryId,
      entity,
      operation: 'REMOVE',
      state: { activityId: { [Op.in]: nodes.map(it => it.id) } },
      createdAt: { [Op.gt]: timestamp }
    }
  });
  const removedEntityIds = removes.map(it => it.state.id);
  const ids = [...entityIds, ...removedEntityIds].map(Number);
  if (!ids.length) return [];
  const where = {
    repositoryId,
    entity,
    operation: 'UPDATE',
    state: { id: { [Op.in]: ids } },
    createdAt: { [Op.lt]: timestamp }
  };
  return Revision.scope('lastByEntity')
    .findAll({ where })
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
  getStateByMoment,
  resolve
};
