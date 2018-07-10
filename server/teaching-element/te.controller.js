'use strict';

const { Activity, Course, TeachingElement, Sequelize } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { NOT_FOUND, BAD_REQUEST } = require('http-status-codes');
const { resolveStatics } = require('../shared/storage/helpers');
const { getContentContainer } = require('../../config/shared/activities');
const pick = require('lodash/pick');
const get = require('lodash/get');

function list({ course, query, opts }, res) {
  if (query.activityId || query.parentId) {
    const { activityId, parentId } = query;
    const where = { $or: [] };
    if (activityId) where.$or.push({ id: parseInt(activityId, 10) });
    if (parentId) where.$or.push({ parentId: parseInt(parentId, 10) });
    opts.include = { model: Activity, attributes: [], where };
  }
  if (!query.detached) opts.where.$and = [{ detached: false }];

  const elements = query.integration
    ? course.getTeachingElements(opts)
    : TeachingElement.fetch(opts);
  return elements.then(data => res.json({ data }));
}

function show({ params }, res) {
  const teId = parseInt(params.teId, 10);
  return TeachingElement.fetch(teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => res.json({ data: asset }));
}

function create({ body, params, user }, res) {
  const attr = ['activityId', 'type', 'data', 'position', 'refs'];
  const data = Object.assign(pick(body, attr), { courseId: params.courseId });
  return validateElementQuantity(data.activityId)
    .then(() => TeachingElement.create(data, { context: { userId: user.id } }))
    .then(asset => resolveStatics(asset))
    .then(asset => res.json({ data: asset }));
}

function patch({ body, params, user }, res) {
  const attrs = ['refs', 'type', 'data', 'position', 'courseId', 'deletedAt'];
  const data = pick(body, attrs);
  const paranoid = body.paranoid !== false;
  return TeachingElement.findById(params.teId, { paranoid })
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.update(data, { context: { userId: user.id } }))
    .then(asset => resolveStatics(asset))
    .then(asset => res.json({ data: asset }));
}

function remove({ params, user }, res) {
  return TeachingElement.findById(params.teId)
    .then(asset => asset || createError(NOT_FOUND, 'TEL not found'))
    .then(asset => asset.destroy({ context: { userId: user.id } }))
    .then(() => res.end());
}

function reorder({ body, params }, res) {
  return TeachingElement.findById(params.teId)
    .then(asset => asset.reorder(body.position))
    .then(asset => res.json({ data: asset }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove,
  reorder
};

function validateElementQuantity(activityId) {
  return Activity.findById(activityId, {
    attributes: {
      include: [[
        Sequelize.fn('COUNT', Sequelize.col('TeachingElements.id')),
        'elementsCount'
      ]]},
    include: [{
      model: Course, attributes: ['schema']}, {
      model: TeachingElement, attributes: []
    }],
    group: ['activity.id', 'course.id']
  })
  .then(
    (activity) => {
      const elementsCount = Number(get(activity, 'dataValues.elementsCount', 0));
      const schema = get(activity, 'course.schema');
      const containerType = get(activity, 'type');
      return (elementsCount === get(getContentContainer(schema, containerType), 'elementsLimit'))
        ? createError(BAD_REQUEST, 'TEL limit reached')
        : true;
    }
  );
}
