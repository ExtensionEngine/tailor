'use strict';

const { Course, CourseUser, Revision, sequelize, User } = require('../shared/database');
const { createContentInventory } = require('../integrations/knewton');
const { createError } = require('../shared/error/helpers');
const { getSchema } = require('../../config/shared/activities');
const getVal = require('lodash/get');
const map = require('lodash/map');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const pick = require('lodash/pick');
const publishingService = require('../shared/publishing/publishing.service');
const sample = require('lodash/sample');

const DEFAULT_COLORS = ['#689F38', '#FF5722', '#2196F3'];
const lowercaseName = sequelize.fn('lower', sequelize.col('name'));

function index({ query, user, opts }, res) {
  if (query.search) opts.where.name = { [Op.iLike]: `%${query.search}%` };
  if (getVal(opts, 'order.0.0') === 'name') opts.order[0][0] = lowercaseName;
  opts.include = [{
    model: Revision,
    include: [{ model: User, attributes: ['id', 'email'] }],
    order: [['createdAt', 'DESC']],
    limit: 1
  }];
  const courseUser = query.pinned
    ? { where: { userId: user.id, pinned: true }, required: true }
    : { where: { userId: user.id }, required: false };
  opts.include.push({ model: CourseUser, ...courseUser });
  const courses = user.isAdmin() ? Course.findAll(opts) : user.getCourses(opts);
  return courses.then(data => res.json({ data }));
}

function create({ body, user }, res) {
  const defaultMeta = getVal(getSchema(body.schema), 'defaultMeta', {});
  const data = { color: sample(DEFAULT_COLORS), ...defaultMeta, ...body.data };
  return Course.create({ ...body, data }, {
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
}

function remove({ course, user }, res) {
  return course.destroy({ context: { userId: user.id } })
    .then(() => res.status(204).send());
}

async function pin({ user, course, body }, res) {
  const opts = { where: { courseId: course.id, userId: user.id } };
  const [courseUser] = await CourseUser.findOrCreate(opts);
  courseUser.pinned = body.pin;
  await courseUser.save();
  return res.json({ data: courseUser });
}

function clone({ user, course, body }, res) {
  const { name, description } = body;
  const context = { userId: user.id };
  return course.clone(name, description, context)
    .then(course => res.json({ data: course }));
}

function publishRepoInfo({ course }, res) {
  return publishingService.publishRepoDetails(course)
    .then(data => res.json({ data }));
}

function getUsers(req, res) {
  return req.course.getUsers()
    .then(users => res.json({ data: map(users, transform) }));
}

function upsertUser({ course, body }, res) {
  const { email, role } = body;
  return User.inviteOrUpdate({ email })
    .then(user => findOrCreateRole(course, user, role))
    .then(user => Object.assign({}, user.profile, { courseRole: role }))
    .then(user => res.json({ data: { user } }));
}

function removeUser(req, res) {
  const { course } = req;
  const { userId } = req.params;
  return User.findByPk(userId)
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
}

function exportContentInventory({ course }, res) {
  return course.getInventoryItems()
    .then(({ activities, tes }) => {
      const workbook = createContentInventory(course, activities, tes);
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
  pin,
  clone,
  getUsers,
  upsertUser,
  removeUser,
  exportContentInventory,
  publishRepoInfo
};
