'use strict';
const { Revision, Sequelize } = require('../shared/database');

const { Op } = Sequelize;

function getByEntity(query, options) {
  const { repositoryId, entity, entityId } = query;
  const where = {
    repositoryId,
    entity,
    state: { id: entityId }
  };
  return Revision.findAll({ ...options, where });
}

async function getPublished(query, options) {
  const { repositoryId, activityIds, entity, entityIds = [], publishedOn } = query;
  const removes = await Revision.findAll({
    attributes: ['state'],
    where: {
      repositoryId,
      entity,
      operation: 'REMOVE',
      state: { activityId: { [Op.in]: activityIds } },
      createdAt: { [Op.gt]: publishedOn }
    }
  });
  const removedEntityIds = removes.map(it => it.state.id);
  const ids = [...entityIds, ...removedEntityIds];
  if (!ids.length) return [];
  const where = {
    repositoryId,
    entity,
    operation: 'UPDATE',
    state: { id: { [Op.in]: ids } },
    createdAt: { [Op.lt]: publishedOn }
  };
  return Revision.scope('lastByEntity').findAll({ ...options, where });
}

module.exports = { getByEntity, getPublished };
