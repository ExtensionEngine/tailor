'use strict';

const { Repository, RepositoryUser, Revision, sequelize, User, Tag, EntityTag } = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { getSchema } = require('../../config/shared/activities');
const getVal = require('lodash/get');
const map = require('lodash/map');
const { NOT_FOUND } = require('http-status-codes');
const { Op } = require('sequelize');
const pick = require('lodash/pick');
const publishingService = require('../shared/publishing/publishing.service');
const { repository: role } = require('../../config/shared').role;
const sample = require('lodash/sample');

const DEFAULT_COLORS = ['#689F38', '#FF5722', '#2196F3'];
const lowercaseName = sequelize.fn('lower', sequelize.col('name'));

function index({ query, user, opts }, res) {
  if (query.search) opts.where.name = { [Op.iLike]: `%${query.search}%` };
  if (query.schema) opts.where.schema = { [Op.eq]: query.schema };
  if (getVal(opts, 'order.0.0') === 'name') opts.order[0][0] = lowercaseName;
  opts.include = [{
    model: Revision,
    include: [{
      model: User,
      attributes: [
        'id', 'email', 'firstName', 'lastName', 'fullName', 'label', 'imgUrl'
      ]
    }],
    order: [['createdAt', 'DESC']],
    limit: 1
  }, { model: Tag }];
  const repositoryUser = query.pinned
    ? { where: { userId: user.id, pinned: true }, required: true }
    : { where: { userId: user.id }, required: false };
  opts.include.push({ model: RepositoryUser, ...repositoryUser });
  const repositories = user.isAdmin()
    ? Repository.findAll(opts)
    : user.getRepositories(opts);
  return repositories.then(data => res.json({ data }));
}

async function create({ user, body }, res) {
  const defaultMeta = getVal(getSchema(body.schema), 'defaultMeta', {});
  const data = { color: sample(DEFAULT_COLORS), ...defaultMeta, ...body.data };
  const repository = await Repository.create({ ...body, data }, {
    isNewRecord: true,
    returning: true,
    context: { userId: user.id }
  });
  await RepositoryUser.create({
    repositoryId: repository.id,
    userId: user.id,
    role: role.ADMIN
  });
  return res.json({ data: repository });
}

function get({ repository }, res) {
  return res.json({ data: repository });
}

function patch({ user, repository, body }, res) {
  const data = pick(body, ['name', 'description', 'data']);
  return repository.update(data, { context: { userId: user.id } })
    .then(repository => res.json({ data: repository }));
}

async function remove({ user, repository }, res) {
  const repo = await repository.destroy({ context: { userId: user.id } });
  publishingService.updateRepositoryCatalog(repo);
  return res.status(204).send();
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
    .then(users => res.json({
      data: map(users, it => ({ ...it.profile, repositoryRole: it.repositoryUser.role }))
    }));
}

function upsertUser({ repository, body }, res) {
  const { email, role } = body;
  return User.inviteOrUpdate({ email })
    .then(user => findOrCreateRole(repository, user, role))
    .then(user => ({ ...user.profile, repositoryRole: role }))
    .then(user => res.json({ data: { user } }));
}

function removeUser(req, res) {
  const { repository, params: { userId } } = req;
  const where = { userId, repositoryId: repository.id };
  return User.findByPk(userId)
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(() => RepositoryUser.destroy({ where, force: true }))
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

function getTags({ repository }, res) {
  return repository.getTags()
    .then(tags => res.json({ data: tags }));
}

function createTag({ body, repository }, res) {
  const { name, type } = body;
  return sequelize.transaction(async transaction => {
    const [tag] = await Tag.findOrCreate({ where: { name }, transaction });
    const repo = await repository.addTags([tag], { through: { type }, transaction });
    return res.json({ data: { tag, repo } });
  });
}

async function removeTag(req, res) {
  const { params: { tagId, repositoryId } } = req;
  const where = { tagId, repositoryId };
  const entityTag = await EntityTag.findOne({ where });
  return entityTag.destroy()
    .then(() => res.json({ data: entityTag }));
}

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
  publishRepoInfo,
  getTags,
  createTag,
  removeTag
};
