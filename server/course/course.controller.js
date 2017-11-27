const { createError } = require('../shared/error/helpers');
const { Course, CourseUser, User } = require('../shared/database');
const { createContentInventory } = require('../integrations/knewton');
const { NOT_FOUND } = require('http-status-codes');
const map = require('lodash/map');
const pick = require('lodash/pick');
const processListQuery = require('../shared/util/processListQuery');
const publishingService = require('../shared/publishing/publishing.service');

function index({ query, user }, res) {
  const opts = processListQuery(query);
  if (query.search) opts.where.name = { $iLike: `%${query.search}%` };
  const courses = user.isAdmin() ? Course.findAll(opts) : user.getCourses(opts);
  return courses.then(data => res.json({ data }));
};

function create({ body, user }, res) {
  return Course.create(body, {
    isNewRecord: true,
    returning: true,
    context: { userId: user.id }
  }).then(course => res.json({ data: course }));
}

function get(req, res) {
  res.json({ data: req.course });
}

function patch({ body, course, user }, res) {
  const data = pick(body, ['name', 'description', 'data']);
  return course.update(data, { context: { userId: user.id } })
    .then(course => res.json({ data: course }));
};

function remove({ course, user }, res) {
  return course.destroy({ context: { userId: user.id } })
    .then(() => res.status(204).send());
};

function publish({ course }, res) {
  return publishingService.publishRepoDetails(course);
};

function getUsers(req, res) {
  return req.course.getUsers()
    .then(users => res.json({ data: map(users, transform) }));
}

function upsertUser({ course, body }, res) {
  const { email, role } = body;
  return User.findOne({ where: { email } })
    .then(user => user || User.invite({ email }))
    .then(user => findOrCreateRole(course, user, role))
    .then(user => Object.assign({}, user.profile, { courseRole: role }))
    .then(user => res.json({ data: { user } }));
}

function removeUser(req, res) {
  const { course } = req;
  const { userId } = req.params;
  return User.findById(userId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => course.removeUser(user))
    .then(() => res.end());
}

function findOrCreateRole(course, user, role) {
  return CourseUser.findOrCreate({
    where: { courseId: course.id, userId: user.id },
    defaults: { courseId: course.id, userId: user.id, role },
    paranoid: false
  })
  .then(([cu, created]) => created ? cu : cu.update({ role }))
  .then(cu => cu.deletedAt ? cu.restore() : cu)
  .then(() => user);
};

function exportContentInventory({ course }, res) {
  return course.getInventoryItems()
    .then(({ activities, tes }) => {
      let workbook = createContentInventory(course, activities, tes);
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-disposition', 'attachment;filename=report.xls');
      return workbook.xlsx.write(res).then(() => res.end());
    });
}

const transform = user => {
  return Object.assign(user.profile, { courseRole: user.courseUser.role });
};

module.exports = {
  index,
  create,
  get,
  patch,
  remove,
  getUsers,
  upsertUser,
  removeUser,
  exportContentInventory,
  publish
};
