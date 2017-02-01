'use strict';

const { createError } = require('../shared/error/helpers');
const { Course, User } = require('../shared/database/sequelize');
const { NOT_FOUND } = require('http-status-codes');
const map = require('lodash/map');
const omit = require('lodash/omit');

const userRoles = require('../../config/shared').role.user;
const courseRoles = require('../../config/shared').role.course;
const params = require('../../config/server').queryParams;

function index(req, res) {
  const user = req.user;
  const offset = parseInt(req.query.offset, 10) || 0;
  const limit = parseInt(req.query.limit, 10) || params.pagination.limit;
  const order = [[
    req.query.sortBy || params.sort.field,
    req.query.sortOrder || params.sort.order.ASC
  ]];
  const where = req.query.search
    ? { name: { $iLike: `%${req.query.search}%` } }
    : undefined;

  const opts = { offset, limit, order, where };
  const promise = user.isAdmin() ? Course.findAll(opts) : user.getCourses(opts);
  return promise.then(courses => res.json({ data: courses }));
};

function getUsers(req, res) {
  return req.course.getUsers()
    .then(users => res.json({ data: map(users, transform) }));
}

function upsertUser(req, res) {
  const { course } = req;
  const { email, role } = req.body;
  return User.findOne({ where: { email } })
    .then(user => user || User.invite({ email }))
    // TODO: Find out why through: { role } isn't working
    .then(user => course.addUser(user).then(() => user))
    .then(user => course.getUser(user))
    .then(user => {
      user.courseUser.role = role;
      return user.courseUser.save().then(() => transform(user));
    })
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

const transform = user => {
  return Object.assign(user.profile, { courseRole: user.courseUser.role });
};

function patch(req, res) {
  const id = req.params.id;
  const course = omit(req.body, ['id', 'created_at', 'updated_at']);
  return Course.update(course, { where: { id }, returning: true })
    .then(([n, courses]) => n
      ? res.status(200).json({ data: courses[0] })
      : res.status(404).send());
};

function remove(req, res) {
  const id = req.params.id;
  return Course.destroy({ where: { id } })
    .then(() => res.status(204).send());
};

function canPatch(req, res) {
  const user = req.user;
  return user.role === userRoles.ADMIN
    ? Promise.resolve('next')
    : user.getCourses().then(courses => {
      // eslint-disable-next-line eqeqeq
      const course = courses.find(c => c.id == req.params.id);
      return course && course.courseUser.role === courseRoles.ADMIN
        ? Promise.resolve('next')
        : res.status(401).send();
    });
};

function canRemove(req, res) {
  return req.user.role === userRoles.ADMIN
    ? Promise.resolve('next')
    : res.status(401).send();
};

module.exports = {
  index,
  patch,
  remove,
  canPatch,
  canRemove,
  getUsers,
  upsertUser,
  removeUser
};
