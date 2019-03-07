'use strict';

const { Course, CourseUser, User } = require('../shared/database');
const { createContentInventory } = require('../integrations/knewton');
const { createError } = require('../shared/error/helpers');
const { getSchema } = require('../../config/shared/activities');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const getVal = require('lodash/get');
const map = require('lodash/map');
const pick = require('lodash/pick');
const publishingService = require('../shared/publishing/publishing.service');
const sample = require('lodash/sample');
const path = require('path');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const download = require('../shared/download/helpers');
const JSZip = require('jszip');

const DEFAULT_COLORS = ['#689F38', '#FF5722', '#2196F3'];

function index({ query, user, opts }, res) {
  if (query.search) opts.where.name = { [Op.iLike]: `%${query.search}%` };
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
}

function exportContentInventory({ course }, res) {
  return course.getInventoryItems()
    .then(({ activities, tes }) => {
      let workbook = createContentInventory(course, activities, tes);
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-disposition', 'attachment;filename=report.xls');
      return workbook.xlsx.write(res).then(() => res.end());
    });
}

function downloadCourse({ course }, res) {
  download.publishRepositoryDetails(course)
  .then(() => download.readdir(path.join(__dirname, `../../data/tempRepository/${course.dataValues.id}`), 'utf8'))
  .then(readFiles => {
    let zip = new JSZip();
    Promise.map(readFiles, (file) => {
      return fs.readFileAsync(path.join(__dirname, `../../data/tempRepository/${course.dataValues.id}/${file}`), 'utf8')
      .then(data => {
        zip.file(file, data);
      });
    })
    .then(() => {
      return zip.generateAsync({ type: 'base64' })
      .then((file) => res.json({ data: { file } }));
    })
    .then(() => download.deleteDir(path.join(__dirname, '../../data/tempRepository')));
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
  clone,
  getUsers,
  upsertUser,
  removeUser,
  exportContentInventory,
  publishRepoInfo,
  downloadCourse
};
