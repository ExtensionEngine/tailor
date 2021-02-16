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
  const where = { ...whereRemovedAfter, state: whereCreatedBefore };
  return getRemovesByEntity(map(nodes, 'id'), where)
    .then(removesByEntity => Promise.all(removesByEntity.map(resolveStaticsForEach)))
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
  return Revision.scope('lastByEntity')
    .findAll({
      where: {
        ...whereCreateOrUpdate,
        ...whereBefore,
        ...whereInElementOrActivityIds
      }
    })
    .then(resolveStaticsForEach);
}

module.exports = { getEntityRemovesSinceMoment, getLastState };

function getRemovesByEntity(ids, where) {
  return Promise.all([
    Revision.findAll({
      where: {
        ...where,
        entity: 'ACTIVITY',
        state: { ...where.state, id: { [Op.in]: ids } }
      }
    }),
    Revision.findAll({
      where: {
        ...where,
        entity: 'CONTENT_ELEMENT',
        state: { ...where.state, activityId: { [Op.in]: ids } }
      }
    })
  ]);
}

function resolveStaticsForEach(revisions) {
  return Promise.all(revisions.map(async revision => {
    const state = await resolveStatics(revision.state);
    revision.state = state;
    return revision;
  }));
}
