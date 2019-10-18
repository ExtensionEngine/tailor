'use strict';

const { Activity } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { fetchActivityContent } = require('../shared/publishing/helpers');
const find = require('lodash/find');
const get = require('lodash/get');
const { getOutlineLevels } = require('../../config/shared/activities');
const { NOT_FOUND } = require('http-status-codes');
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
    .then(data => res.json({ data }));
}

function removeLink({ course, activity, user }, res) {
  if (!course.isLinkingEnabled) return createError(NOT_FOUND, 'Not found');
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

function clone({ course, activity, body }, res) {
  const { position, courseId } = body;
  const { isLinkingEnabled } = course;
  const shouldCloneOrigins = courseId !== activity.courseId;
  const options = { ...body, isLinkingEnabled, shouldCloneOrigins };
  if (position) activity.position = position;
  return activity.clone(options).then(mappings => {
    const opts = { where: { id: Object.values(mappings) } };
    return Activity.findAll(opts).then(data => res.json({ data }));
  });
}

function link({ course, activity, body }, res) {
  const { isLinkingEnabled } = course;
  if (!course.isLinkingEnabled) return createError(NOT_FOUND, 'Not found');
  return activity.link({ ...body, isLinkingEnabled }).then(mappings => {
    const opts = { where: { id: mappings } };
    return Activity.findAll(opts).then(data => res.json({ data }));
  });
}

function getPreviewUrl({ activity }, res) {
  return fetchActivityContent(activity, true)
    .then(content => {
      const body = {
        ...pick(activity, ['id', 'uid', 'type']),
        repositoryId: activity.courseId,
        meta: activity.data,
        ...content
      };
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
    parentId: activity.parentId,
    originParentId: parent.origin.id
  });
  return Activity.findByPk(activity.id);
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
