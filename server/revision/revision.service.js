'use strict';

const { Revision, Sequelize } = require('../shared/database');
const map = require('lodash/map');
const { resolveStatics } = require('../shared/storage/helpers');

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
  const inNodeIds = { [Op.in]: map(nodes, 'id') };
  const removesByEntity = await Promise.all([
    Revision.findAll({
      where: {
        ...whereRemovedAfter,
        entity: 'ACTIVITY',
        state: { ...whereCreatedBefore, id: inNodeIds }
      }
    }),
    Revision.findAll({
      where: {
        ...whereRemovedAfter,
        entity: 'CONTENT_ELEMENT',
        state: { ...whereCreatedBefore, activityId: inNodeIds }
      }
    })
  ]);
  const [activities, elements] = await Promise.all(removesByEntity.map(resolveEach));
  return { activities, elements };
}

async function getLastState(ids, activityIds, beforeTimestamp) {
  const whereCreateOrUpdate = {
    operation: { [Op.or]: ['CREATE', 'UPDATE'] }
  };
  const whereBefore = { createdAt: { [Op.lt]: beforeTimestamp } };
  const revisions = await Revision.scope('lastByEntity').findAll({
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
  return resolveEach(revisions);
}

module.exports = { getEntityRemovesSinceMoment, getLastState };

function resolveEach(revisions) {
  return Promise.all(revisions.map(async revision => {
    const state = await resolveStatics(revision.state);
    revision.state = state;
    return revision;
  }));
}
