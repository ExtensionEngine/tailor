'use strict';

const { Activity, Revision, User } = require('../shared/database');
const { getEntityRemovesSinceMoment, getLastState } = require('./revision.service.js');
const map = require('lodash/map');
const { resolveStatics } = require('../shared/storage/helpers');

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
  const elements = await getLastState(entityIds, removedActivityIds, timestamp);
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
