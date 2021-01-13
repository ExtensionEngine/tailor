'use strict';

const { Activity, Revision, Sequelize, User } = require('../shared/database');
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

async function getStateByMoment({ repository, query }, res) {
  const { activityId, timestamp } = query;
  const elementIds = (query.elementIds || []).map(Number);
  const repositoryId = repository.id;
  const activity = await Activity.findByPk(activityId);
  const { nodes } = await activity.descendants({ paranoid: false });
  const whereRemoved = {
    repositoryId,
    operation: 'REMOVE',
    createdAt: { [Op.gt]: timestamp }
  };
  const hasNodeId = { [Op.in]: nodes.map(it => it.id) };
  const [removedActivities, removedElements] = await Promise.all([
    Revision.findAll({
      where: {
        ...whereRemoved,
        entity: 'ACTIVITY',
        state: { id: hasNodeId }
      }
    }),
    Revision.findAll({
      attributes: ['state'],
      where: {
        ...whereRemoved,
        entity: 'CONTENT_ELEMENT',
        state: { activityId: hasNodeId }
      }
    })
  ]);
  const removedElementIds = removedElements.map(it => it.state.id);
  const activityIds = removedActivities.map(it => it.state.id);
  const elements = await Revision.scope('lastByEntity').findAll({
    where: {
      repositoryId,
      operation: {
        [Op.or]: ['CREATE', 'UPDATE']
      },
      state: {
        [Op.or]: [{
          id: { [Op.in]: [...elementIds, ...removedElementIds] }
        }, {
          activityId: { [Op.in]: activityIds }
        }]
      },
      createdAt: { [Op.lt]: timestamp }
    }
  });
  return res.json({ data: { elements, activities: removedActivities } });
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
