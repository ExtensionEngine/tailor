import { getEntityRemovesSinceMoment, getLastState } from './revision.service.js';
import db from '../shared/database/index.js';
import map from 'lodash/map.js';

const { Activity, Revision, User } = db;

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

function get({ revision }, res) {
  return res.json(revision);
}

export default {
  index,
  getStateAtMoment,
  get
};
