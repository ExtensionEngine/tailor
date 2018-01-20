const { broadcast, events } = require('./channel');
const { Comment } = require('../shared/database');
const { User } = require('../shared/database');

function list({ course, opts, query }, res) {
  const include = [{ model: User, as: 'author', attributes: ['id', 'email'] }];
  if (query.activityId) {
    opts.where.activityId = query.activityId;
  }
  return course.getComments({ ...opts, include })
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
    .then(comment => {
      const { id, email } = user;
      const message = Object.assign({}, comment.dataValues, { author: { id, email } });
      broadcast(events.CREATE, message);
      return comment;
    })
    .then(data => res.json({ data }));
}

function patch({ comment, body }, res) {
  const { content } = body;
  return comment.update({ content })
    .then(comment => broadcast(events.UPDATE, comment))
    .then(data => res.json({ data }));
}

function remove({ comment }, res) {
  return comment.destroy()
  .then(([comment]) => broadcast(events.DELETE, comment))
  .then(data => res.json({ data }));
}

module.exports = {
  list,
  show,
  create,
  patch,
  remove
};
