'use strict';

const { Repository, RepositoryUser, Revision, sequelize, User } = require('../shared/database');
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
  const repositoryUser = query.pinned
    ? { where: { userId: user.id, pinned: true }, required: true }
    : { where: { userId: user.id }, required: false };
  opts.include.push({ model: RepositoryUser, ...repositoryUser });
  const repositories = user.isAdmin() ? Repository.findAll(opts) : user.getRepositories(opts);
  return repositories.then(data => res.json({ data }));
}

function create({ body, user }, res) {
  const defaultMeta = getVal(getSchema(body.schema), 'defaultMeta', {});
  const data = { color: sample(DEFAULT_COLORS), ...defaultMeta, ...body.data };
  return Repository.create({ ...body, data }, {
    isNewRecord: true,
    returning: true,
    context: { userId: user.id }
  }).then(repository => res.json({ data: repository }));
}

function get(req, res) {
  res.json({ data: req.repository });
}

function patch({ body, repository, user }, res) {
  const data = pick(body, ['name', 'description', 'data']);
  return repository.update(data, { context: { userId: user.id } })
    .then(repository => res.json({ data: repository }));
}

function remove({ repository, user }, res) {
  return repository.destroy({ context: { userId: user.id } })
    .then(() => res.status(204).send());
}

async function pin({ user, repository, body }, res) {
  const opts = { where: { repositoryId: repository.id, userId: user.id } };
  const [repositoryUser] = await RepositoryUser.findOrCreate(opts);
  repositoryUser.pinned = body.pin;
  await repositoryUser.save();
  return res.json({ data: repositoryUser });
}

function clone({ user, repository, body }, res) {
  const { name, description } = body;
  const context = { userId: user.id };
  return repository.clone(name, description, context)
    .then(repository => res.json({ data: repository }));
}

function publishRepoInfo({ repository }, res) {
  return publishingService.publishRepoDetails(repository)
    .then(data => res.json({ data }));
}

function getUsers(req, res) {
  return req.repository.getUsers()
    .then(users => res.json({ data: map(users, transform) }));
}

function upsertUser({ repository, body }, res) {
  const { email, role } = body;
  return User.inviteOrUpdate({ email })
    .then(user => findOrCreateRole(repository, user, role))
    .then(user => Object.assign({}, user.profile, { repositoryRole: role }))
    .then(user => res.json({ data: { user } }));
}

function removeUser(req, res) {
  const { repository } = req;
  const { userId } = req.params;
  return User.findByPk(userId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => repository.removeUser(user))
    .then(() => res.end());
}

function findOrCreateRole(repository, user, role) {
  return RepositoryUser.findOrCreate({
    where: { repositoryId: repository.id, userId: user.id },
    defaults: { repositoryId: repository.id, userId: user.id, role },
    paranoid: false
  })
  .then(([cu, created]) => created ? cu : cu.update({ role }))
  .then(cu => cu.deletedAt ? cu.restore() : cu)
  .then(() => user);
}

function exportContentInventory({ repository }, res) {
  return repository.getInventoryItems()
    .then(({ activities, tes }) => {
      const workbook = createContentInventory(repository, activities, tes);
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-disposition', 'attachment;filename=report.xls');
      return workbook.xlsx.write(res).then(() => res.end());
    });
}

const transform = user => {
  return Object.assign(user.profile, { repositoryRole: user.repositoryUser.role });
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
