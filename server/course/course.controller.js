'use strict';

const omit = require('lodash/omit');
const userRoles = require('../../config/shared').role.user;
const courseRoles = require('../../config/shared').role.course;
const { Course } = require('../shared/database/sequelize');

function index(req, res) {
  const user = req.user;
  return user.getCourses()
    .then(courses => res.json({ data: courses }));
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
  canRemove
};
