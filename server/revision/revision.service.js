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
  const hasNodeId = { [Op.in]: map(nodes, 'id') };
  const [activities, elements] = await Promise.all([
    Revision.findAll({
      where: {
        ...whereRemovedAfter,
        entity: 'ACTIVITY',
        state: { ...whereCreatedBefore, id: hasNodeId }
      }
    }),
    Revision.findAll({
      where: {
        ...whereRemovedAfter,
        entity: 'CONTENT_ELEMENT',
        state: { ...whereCreatedBefore, activityId: hasNodeId }
      }
    })
  ]);
  return { activities, elements };
}

function getLastState(ids, activityIds, beforeTimestamp) {
  const whereCreateOrUpdate = {
    operation: { [Op.or]: ['CREATE', 'UPDATE'] }
  };
  const whereBefore = { createdAt: { [Op.lt]: beforeTimestamp } };
  return Revision.scope('lastByEntity').findAll({
    where: {
      ...whereCreateOrUpdate,
      ...whereBefore,
      state: {
        [Op.or]: [{
          id: { [Op.in]: ids }
        }, {
          activityId: { [Op.in]: activityIds }
        }]
      }
    }
  });
}

module.exports = { getEntityRemovesSinceMoment, getLastState };
