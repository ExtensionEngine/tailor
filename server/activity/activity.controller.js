'use strict';

const { Activity } = require('../shared/database');
const { fetchActivityContent } = require('../shared/publishing/helpers');
const find = require('lodash/find');
const get = require('lodash/get');
const pick = require('lodash/pick');
const { previewUrl } = require('../../config/server');
const publishingService = require('../shared/publishing/publishing.service');
const request = require('axios');
const { schema } = require('@tailor-cms/config');

const { getOutlineLevels, isOutlineActivity } = schema;

function list({ repository, query, opts }, res) {
  if (!query.detached) opts.where = { detached: false };
  return repository.getActivities(opts)
    .then(data => res.json({ data }));
}

function create({ user, repository, body }, res) {
  const outlineConfig = find(getOutlineLevels(repository.schema), { type: body.type });
  const data = {
    ...pick(body, ['uid', 'type', 'parentId', 'position']),
    data: { ...get(outlineConfig, 'defaultMeta', {}), ...body.data },
    repositoryId: repository.id
  };
  const context = { userId: user.id, repository };
  return Activity.create(data, { context })
    .then(data => res.json({ data }));
}

function show({ activity }, res) {
  return res.json({ data: activity });
}

function patch({ repository, user, activity, body }, res) {
  const context = { userId: user.id, repository };
  return activity.update(body, { context })
    .then(data => res.json({ data }));
}

function remove({ user, repository, activity }, res) {
  const context = { userId: user.id, repository };
  const options = { recursive: true, soft: true, context };
  const unpublish = activity.publishedAt
    ? publishingService.unpublishActivity(repository, activity)
    : Promise.resolve();
  return unpublish
    .then(async () => {
      const deleted = await activity.remove(options);
      await updatePublishingStatus(repository, activity);
      return res.json({ data: pick(deleted, ['id']) });
    });
}

function reorder({ activity, body, repository, user }, res) {
  const context = { userId: user.id, repository };
  return activity.reorder(body.position, context)
    .then(data => res.json({ data }));
}

function publish({ activity }, res) {
  return publishingService.publishActivity(activity)
    .then(data => res.json({ data }));
}

function clone({ activity, body, user }, res) {
  const { repositoryId, parentId, position } = body;
  const context = { userId: user.id };
  return activity.clone(repositoryId, parentId, position, context).then(mappings => {
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

async function updateStatus({ user, body, activity }, res) {
  const context = { user };
  const data = pick(body, ['assigneeId', 'status', 'priority', 'description', 'dueDate']);
  const status = await activity.createStatus(data, { context });
  await status.reload();
  return res.json({ data: status });
}

function updatePublishingStatus(repository, activity) {
  if (!isOutlineActivity(activity.type)) return Promise.resolve();
  return publishingService.updatePublishingStatus(repository);
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
  getPreviewUrl,
  updateStatus
};
