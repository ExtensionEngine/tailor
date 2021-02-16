'use strict';

const { Revision, Sequelize } = require('../shared/database');
const map = require('lodash/map');

const { Op } = Sequelize;

async function getEntityRemovesSinceMoment(activity, timestamp) {
  const { nodes } = await activity.descendants({ paranoid: false });
  const whereRemovedAfter = {
    operation: 'REMOVE',
    createdAt: { [Op.gt]: timestamp }
  };
  const whereCreatedBefore = {
    createdAt: { [Op.lt]: timestamp }
  };
  const where = { ...whereRemovedAfter, state: whereCreatedBefore };
  return getRemovesGroupedByEntity(map(nodes, 'id'), where)
    .then(([activities, elements]) => ({ activities, elements }));
}

function getLastState(ids, activityIds, beforeTimestamp) {
  const whereCreateOrUpdate = {
    operation: { [Op.or]: ['CREATE', 'UPDATE'] }
  };
  const whereBefore = { createdAt: { [Op.lt]: beforeTimestamp } };
  const whereInElementOrActivityIds = {
    state: {
      [Op.or]: [{
        id: { [Op.in]: ids }
      }, {
        activityId: { [Op.in]: activityIds }
      }]
    }
  };
  return Revision.scope('lastByEntity').fetch({
    where: {
      ...whereCreateOrUpdate,
      ...whereBefore,
      ...whereInElementOrActivityIds
    }
  });
}

module.exports = { getEntityRemovesSinceMoment, getLastState };

function getRemovesGroupedByEntity(ids, where) {
  return Promise.all([
    Revision.fetch({
      where: {
        ...where,
        entity: 'ACTIVITY',
        state: { ...where.state, id: { [Op.in]: ids } }
      }
    }),
    Revision.fetch({
      where: {
        ...where,
        entity: 'CONTENT_ELEMENT',
        state: { ...where.state, activityId: { [Op.in]: ids } }
      }
    })
  ]);
}
