'use strict';

const { Activity } = require('../shared/database');
const { fetchActivityContent } = require('../shared/publishing/helpers');
const find = require('lodash/find');
const get = require('lodash/get');
const { getOutlineLevels } = require('../../config/shared/activities');
const pick = require('lodash/pick');
const { previewUrl } = require('../../config/server');
const Promise = require('bluebird');
const publishingService = require('../shared/publishing/publishing.service');
const request = require('axios');

function create({ course, body, params, user }, res) {
  const outlineConfig = find(getOutlineLevels(course.schema), { type: body.type });
  const defaultMeta = !outlineConfig ? {} : get(outlineConfig, 'defaultMeta', {});
  const data = Object.assign(
    pick(body, ['type', 'parentId', 'position']),
    { data: Object.assign({}, defaultMeta, body.data) },
    { courseId: params.courseId });
  const opts = { context: { userId: user.id } };
  return Activity.create(data, opts)
    .then(linkCreated)
    .then(data => res.json({ data }));
}

function show({ activity }, res) {
  return res.json({ data: activity });
}

function patch({ activity, body, user }, res) {
  return activity.update(body, { context: { userId: user.id } })
    .then(data => res.json({ data }));
}

function list({ course, query, opts }, res) {
  if (!query.detached) opts.where = { detached: false };
  return course.getActivities(opts)
    .then(data => res.json({ data }));
}

function remove({ course, activity, user }, res) {
  const options = { recursive: true, soft: true, context: { userId: user.id } };
  const unpublish = activity.publishedAt
    ? publishingService.unpublishActivity(course, activity)
    : Promise.resolve();
  return unpublish
    .then(() => activity.remove(options))
    .then(data => res.json({ data: pick(data, ['id']) }));
}

function removeLink({ course, activity, user }, res) {
  const options = { recursive: true, soft: true, context: { userId: user.id } };
  const unpublish = activity.publishedAt
    ? publishingService.unpublishActivity(course, activity)
    : Promise.resolve();
  return unpublish
    .then(() => activity.removeLink(options))
    .then(data => res.json({ data }));
}

function reorder({ activity, body }, res) {
  return activity.reorder(body.position).then(data => res.json({ data }));
}

function publish({ activity }, res) {
  return publishingService.publishActivity(activity)
    .then(data => res.json({ data }));
}

function clone({ activity, body }, res) {
  const { courseId, parentId, position } = body;
  return activity.clone(courseId, parentId, position).then(mappings => {
    const opts = { where: { id: Object.values(mappings) } };
    return Activity.findAll(opts).then(data => res.json({ data }));
  });
}

function link({ activity, body }, res) {
  return activity.link(body).then(mappings => {
    const opts = { where: { id: mappings } };
    return Activity.findAll(opts).then(data => res.json({ data }));
  });
}

function getPreviewUrl({ course, activity }, res) {
  return fetchActivityContent(course, activity)
    .then(content => {
      const body = { uid: activity.uid, ...content };
      return request.post(previewUrl, body);
    })
    .then(({ data: { url } }) => {
      return res.json({ location: `${new URL(url, previewUrl)}` });
    });
}

const linkCreated = async activity => {
  if (!activity.parentId) return activity;
  const parent = await activity.getParent();
  if (!parent.isLink) return activity;
  await activity.link({
    position: activity.position,
    parentId: activity.parentId
  });
  await activity.update({ parentId: parent.origin.id });
  return Activity.findByPk(activity.id).then(data => data);
};

module.exports = {
  create,
  show,
  list,
  patch,
  remove,
  removeLink,
  reorder,
  clone,
  link,
  publish,
  getPreviewUrl
};
