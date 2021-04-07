'use strict';

const { NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const {
  Repository,
  RepositoryTag,
  RepositoryUser,
  Revision,
  sequelize,
  Tag,
  User
} = require('../shared/database');
const { createError } = require('../shared/error/helpers');
const { getSchema } = require('../../config/shared/activities');
const getVal = require('lodash/get');
const map = require('lodash/map');
const { Op } = require('sequelize');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const publishingService = require('../shared/publishing/publishing.service');
const { repository: role } = require('../../config/shared').role;
const sample = require('lodash/sample');
const { snakeCase } = require('change-case');
const TransferService = require('../shared/transfer/transfer.service');

const fs = Promise.promisifyAll(require('fs'));
const miss = Promise.promisifyAll(require('mississippi'));
const tmp = Promise.promisifyAll(require('tmp'), { multiArgs: true });

const DEFAULT_COLORS = ['#689F38', '#FF5722', '#2196F3'];
const lowercaseName = sequelize.fn('lower', sequelize.col('repository.name'));

const JobCache = new Map();

const getFilter = search => {
  const term = search.length < 3 ? `${search}%` : `%${search}%`;
  return { [Op.iLike]: term };
};

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
  const { search, schemas, getNames } = query;
  if (search) opts.where.name = getFilter(search);
  if (schemas) opts.where.schema = schemas;
  if (getVal(opts, 'order.0.0') === 'name') opts.order[0][0] = lowercaseName;
  opts.include = [
    includeLastRevision(),
    includeRepositoryUser(user, query),
    ...includeRepositoryTags(query)
  ];
  const repositories = getNames
    ? getRepositoryNames(query)
    : user.isAdmin() ? Repository.findAll(opts) : user.getRepositories(opts);
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

async function initiateExportJob({ repository }, res) {
  const [outFile] = await tmp.fileAsync();
  const options = { repositoryId: repository.id, schemaId: repository.schema };
  return TransferService
    .createExportJob(outFile, options)
    .toPromise()
    .then(job => {
      // TODO: unlink job.filepath after timeout
      JobCache.set(job.id, job);
      res.json({ data: job.id });
    })
    .catch(() => {
      fs.unlinkAsync(outFile);
      return createError(NOT_FOUND);
    });
}

function exportRepository({ repository, params }, res) {
  const { jobId } = params;
  const job = JobCache.get(jobId);
  if (!job) return createError(NOT_FOUND);
  res.attachment(`${snakeCase(repository.name)}.tgz`);
  const exportStream = fs.createReadStream(job.filepath);
  return miss.pipeAsync(exportStream, res)
    .then(() => {
      JobCache.delete(jobId);
      return fs.unlinkAsync(job.filepath);
    });
}

function importRepository({ body, file, user }, res) {
  const { path } = file;
  const { description, name } = body;
  const options = { description, name, userId: user.id };
  return TransferService
    .createImportJob(path, options)
    .toPromise()
    .finally(() => {
      fs.unlinkAsync(path);
      res.end();
    });
}

module.exports = {
  index,
  create,
  get,
  patch,
  remove,
  initiateExportJob,
  export: exportRepository,
  import: importRepository,
  pin,
  clone,
  getUsers,
  upsertUser,
  removeUser,
  publishRepoInfo,
  addTag,
  removeTag
};

function getRepositoryNames({ repositoryId }) {
  const where = repositoryId ? { [Op.not]: { id: repositoryId } } : {};
  return Repository.findAll({ where, attributes: ['name'] });
}
