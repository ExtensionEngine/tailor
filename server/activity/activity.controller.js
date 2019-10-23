'use strict';

const { Activity } = require('../shared/database');
const { fetchActivityContent } = require('../shared/publishing/helpers');
const find = require('lodash/find');
const get = require('lodash/get');
const { getOutlineLevels } = require('../../config/shared/activities');
const pick = require('lodash/pick');
const { previewUrl } = require('../../config/server');
const publishingService = require('../shared/publishing/publishing.service');
const request = require('axios');

function create({ repository, body, params, user }, res) {
  const outlineConfig = find(getOutlineLevels(repository.schema), { type: body.type });
  const defaultMeta = !outlineConfig ? {} : get(outlineConfig, 'defaultMeta', {});
  const data = Object.assign(
    pick(body, ['type', 'parentId', 'position']),
    { data: Object.assign({}, defaultMeta, body.data) },
    { repositoryId: params.repositoryId });
  const opts = { context: { userId: user.id } };
  return Activity.create(data, opts).then(data => res.json({ data }));
}

function show({ activity }, res) {
  return res.json({ data: activity });
}

function patch({ activity, body, user }, res) {
  return activity.update(body, { context: { userId: user.id } })
    .then(data => res.json({ data }));
}

function list({ repository, query, opts }, res) {
  if (!query.detached) opts.where = { detached: false };
  return repository.getActivities(opts).then(data => res.json({ data }));
}

function remove({ repository, activity, user }, res) {
  const options = { recursive: true, soft: true, context: { userId: user.id } };
  const unpublish = activity.publishedAt
    ? publishingService.unpublishActivity(repository, activity)
    : Promise.resolve();
  return unpublish
    .then(() => activity.remove(options))
    .then(data => res.json({ data: pick(data, ['id']) }));
}

function reorder({ activity, body }, res) {
  return activity.reorder(body.position).then(data => res.json({ data }));
}

function publish({ activity }, res) {
  return publishingService.publishActivity(activity)
    .then(data => res.json({ data }));
}

function clone({ activity, body }, res) {
  const { repositoryId, parentId, position } = body;
  return activity.clone(repositoryId, parentId, position).then(mappings => {
    const opts = { where: { id: Object.values(mappings) } };
    return Activity.findAll(opts).then(data => res.json({ data }));
  });
}

function getPreviewUrl({ activity }, res) {
  return fetchActivityContent(activity, true)
    .then(content => {
      const body = {
        ...pick(activity, ['id', 'uid', 'type']),
        repositoryId: activity.repositoryId,
        meta: activity.data,
        ...content
      };
      return request.post(previewUrl, body);
    })
    .then(({ data: { url } }) => {
      return res.json({ location: `${new URL(url, previewUrl)}` });
    });
}

module.exports = {
  create,
  show,
  list,
  patch,
  remove,
  reorder,
  clone,
  publish,
  getPreviewUrl
};
