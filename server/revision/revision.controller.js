'use strict';

const {
  Activity,
  ContentElement,
  Revision,
  Sequelize: { Op },
  User
} = require('../shared/database');
const { getOutlineLevels } = require('../../config/shared/activities');
const map = require('lodash/map');
const { resolveStatics } = require('../shared/storage/helpers');

async function index({ repository, query }, res) {
  const { limit, offset, entity, entityId, descendants } = query;
  const where = { repositoryId: repository.id };
  if (entity) {
    where.entity = entity;
    where.state = { id: entityId };
  } else if (descendants) {
    where[Op.or] = await buildDescendantsCondition(entityId, repository);
  }
  const include = [{
    model: User,
    paranoid: false,
    attributes: ['id', 'email', 'firstName', 'lastName', 'fullName', 'label']
  }];
  const opts = { where, include, order: [['createdAt', 'DESC']], limit, offset };
  return Revision.findAll(opts).then(data => res.json({ data }));
}

function resolve({ revision }, res) {
  return resolveStatics(revision.state).then(state => {
    revision.state = state;
    return res.json(revision);
  });
}

module.exports = {
  index,
  resolve
};

async function buildDescendantsCondition(entityId, repository) {
  const activityIds = await getNonOutlineDescendantIds(entityId, repository);
  const elementIds = await getContentElementIds(activityIds);
  return [
    ...map(activityIds, id => ({ entity: 'ACTIVITY', state: { id } })),
    ...map(elementIds, id => ({ entity: 'CONTENT_ELEMENT', state: { id } }))
  ];
}

function getNonOutlineDescendantIds(entityId, repository) {
  const skippedTypes = map(getOutlineLevels(repository.schema), 'type');
  const attributes = ['id', 'type'];
  return Activity.findByPk(entityId)
    .then(activity => activity.descendants({ attributes, skippedTypes }))
    .then(descendants => descendants.nodes)
    .map(it => it.id);
}

function getContentElementIds(activityIds) {
  return ContentElement.findAll({
    where: { activityId: activityIds },
    attributes: ['id']
  }).map(it => it.id);
}
