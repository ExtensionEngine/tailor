const { broadcast, events } = require('./channel');
const { Comment } = require('../shared/database');
const { User } = require('../shared/database');

function sanitizeDeleted(comments) {
  const deletedMsg = 'This comment has been deleted';
  return comments.map(comment => {
    if (!comment.deletedAt) return comment;
    return Object.assign(comment, { content: deletedMsg });
  });
}

function list({ course, opts, query }, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (query.activityId) {
    opts.where.activityId = query.activityId;
  }
  return course.getComments({ ...opts, include })
    .then(sanitizeDeleted)
    .then(data => res.json({ data }));
}

function show({ comment }, res) {
  return res.json({ data: comment });
}

function create({ body, params, user }, res) {
  const { content, activityId } = body;
  const { courseId } = params;
  const authorId = user.id;
  return Comment.create({ content, activityId, courseId, authorId })
    .then(comment => broadcast(events.NEW, comment))
    .then(data => res.json({ data }));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(comment => broadcast(events.MODIFY, comment))
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
    .then(comment => sanitizeDeleted([comment]))
    .then(([comment]) => broadcast(events.REMOVE, comment))
    .then(data => res.json({ data }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
