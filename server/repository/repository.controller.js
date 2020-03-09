'use strict';

const {
  Repository, RepositoryUser, Revision, sequelize, User, Tag, RepositoryTag
} = require('../shared/database');
const { NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const { createError } = require('../shared/error/helpers');
const { getSchema } = require('../../config/shared/activities');
const getVal = require('lodash/get');
const map = require('lodash/map');
const { Op } = require('sequelize');
const pick = require('lodash/pick');
const publishingService = require('../shared/publishing/publishing.service');
const { repository: role } = require('../../config/shared').role;
const sample = require('lodash/sample');

const DEFAULT_COLORS = ['#689F38', '#FF5722', '#2196F3'];
const lowercaseName = sequelize.fn('lower', sequelize.col('name'));
const includeLastRevision = () => ({
  model: Revision,
  include: [{
    model: User,
    paranoid: false,
    attributes: [
      'id', 'email', 'firstName', 'lastName', 'fullName', 'label', 'imgUrl'
    ]
  }],
  order: [['createdAt', 'DESC']],
  limit: 1
});
const includeRepositoryUser = (user, query) => {
  const options = query && query.pinned
    ? { where: { userId: user.id, pinned: true }, required: true }
    : { where: { userId: user.id }, required: false };
  return { model: RepositoryUser, ...options };
};

const includeRepositoryTags = query => {
  const include = [{ model: Tag }];
  return query.tagIds
    ? [...include, { model: RepositoryTag, where: { tagId: query.tagIds } }]
    : include;
};

function index({ query, user, opts }, res) {
  if (query.search) opts.where.name = { [Op.iLike]: `%${query.search}%` };
  if (query.schema) opts.where.schema = { [Op.eq]: query.schema };
  if (getVal(opts, 'order.0.0') === 'name') opts.order[0][0] = lowercaseName;
  opts.include = [
    includeLastRevision(),
    includeRepositoryUser(user, query),
    ...includeRepositoryTags(query)
  ];
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

async function get({ repository, user }, res) {
  const include = [includeLastRevision(), includeRepositoryUser(user), { model: Tag }];
  await repository.reload({ include });
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

function addTag({ body: { name }, repository }, res) {
  return sequelize.transaction(async transaction => {
    const [tag] = await Tag.findOrCreate({ where: { name }, transaction });
    await repository.addTags([tag], { transaction });
    return res.json({ data: tag });
  });
}

async function removeTag({ params: { tagId, repositoryId } }, res) {
  const where = { tagId, repositoryId };
  await RepositoryTag.destroy({ where });
  return res.status(NO_CONTENT).send();
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
  addTag,
  removeTag
};
