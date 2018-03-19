const { Activity } = require('../shared/database');
const { getLevel } = require('../../config/shared/activities');

const get = require('lodash/get');
const pick = require('lodash/pick');
const publishingService = require('../shared/publishing/publishing.service');

function create({ body, params, user }, res) {
  const defaultMeta = get(getLevel(body.type), 'defaultMeta', {});
  const data = Object.assign(
    pick(body, ['type', 'parentId', 'position']),
    { data: Object.assign({}, defaultMeta, body.data) },
    { courseId: params.courseId });
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

function list({ course, query, opts }, res) {
  if (!query.detached) opts.where.$and = [{ detached: false }];
  return course.getActivities(opts).then(data => res.json({ data }));
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
    const opts = { where: { id: { $in: Object.values(mappings) } } };
    return Activity.findAll(opts).then(data => res.json({ data }));
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
  publish
};
