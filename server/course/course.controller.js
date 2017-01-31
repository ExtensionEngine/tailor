'use strict';

const omit = require('lodash/omit');
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

module.exports = {
  index,
  patch,
  remove
};
