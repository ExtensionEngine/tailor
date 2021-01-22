'use strict';

const { Activity, Revision, Sequelize, User } = require('../shared/database');
const map = require('lodash/map');
const { resolveStatics } = require('../shared/storage/helpers');

const { Op } = Sequelize;

function index({ repository, query, opts }, res) {
  const { entity, entityId } = query;
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
  Object.assign(opts, { where, include });
  return Revision.findAll(opts).then(data => res.json({ data }));
}

async function getStateAtMoment({ query }, res) {
  const { activityId, elementIds, timestamp } = query;
  const activity = await Activity.findByPk(activityId);
  const removes = await getEntityRemovesSinceMoment(activity, timestamp);
  const entityIds = [...elementIds, ...map(removes.elements, 'state.id')];
  const removedActivityIds = map(removes.activities, 'state.id');
  const elements = await getLastRevision(entityIds, removedActivityIds, timestamp);
  return res.json({ data: { ...removes, elements } });
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

module.exports = {
  index,
  getStateAtMoment,
  resolve
};

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

function getLastRevision(ids, activityIds, beforeTimestamp) {
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
