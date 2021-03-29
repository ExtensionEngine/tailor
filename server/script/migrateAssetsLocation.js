'use strict';

const {
  Activity,
  ContentElement,
  Repository,
  Revision,
  sequelize
} = require('../shared/database');
const get = require('lodash/get');
const Listr = require('listr');
const { Op } = require('sequelize');
const path = require('path');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const { SCHEMAS } = require('../../config/shared/activities');
const storage = require('../repository/storage');
const toPairs = require('lodash/toPairs');

const ASSET_PATH_REGEX = /(?<directory>repository\/assets\/(?<fileName>[^?]*))/;
const REVISION_TYPES = ['REPOSITORY', 'ACTIVITY', 'CONTENT_ELEMENT'];
const CHUNK_SIZE = 2000;

const mapEntityToAction = {
  REPOSITORY: 'migrateRepository',
  ACTIVITY: 'migrateActivity',
  CONTENT_ELEMENT: 'migrateContentElement'
};

class Migration {
  async initialize() {
    this.transaction = await sequelize.transaction();
    this.schemasMeta = getFileMetas(SCHEMAS);
  }

  async getTasks() {
    const { schemasMeta, transaction } = this;
    const repositories = await Repository.findAll({ transaction });
    const tasks = repositories.map(repository => ({
      title: `Migrate repository "${repository.name}"`,
      task: () => {
        const schemaMeta = get(schemasMeta, repository.schema);
        const repositoryMigration = new RepositoryMigration({ repository, schemaMeta, transaction });
        return repositoryMigration.getTasks();
      }
    }));
    return new Listr(tasks);
  }

  async run() {
    const tasks = await this.getTasks();
    return tasks.run().then(() => this.transaction.commit());
  }
}

class RepositoryMigration {
  constructor({ repository, schemaMeta, transaction }) {
    this.repository = repository;
    this.schemaMeta = schemaMeta;
    this.transaction = transaction;
  }

  get metaByActivityType() {
    return this.schemaMeta.metaByActivityType;
  }

  get metaByElementType() {
    return this.schemaMeta.metaByElementType;
  }

  get repositoryId() {
    return this.repository.id;
  }

  getTasks() {
    return new Listr([
      {
        title: 'Migrate repository',
        task: () => this.migrateRepositoryAssets()
      },
      {
        title: 'Migrate activities',
        task: () => this.migrateActivities()
      },
      {
        title: 'Migrate revisions',
        task: () => this.migrateRevisions()
      },
      {
        title: 'Migrate content elements',
        task: () => this.migrateContentElements()
      }
    ]);
  }

  async migrateRepositoryAssets() {
    const payload = await this.migrateRepository();
    return this.repository.update(payload, { transaction: this.transaction });
  }

  async migrateRepository() {
    const { id, data: metaInputs } = this.repository;
    const metaConfigs = get(this.schemaMeta, 'repositoryMeta', []);
    const data = await migrateFileMeta(id, metaInputs, metaConfigs);
    return { data };
  }

  async migrateActivities() {
    const { repositoryId, transaction } = this;
    const activities = await Activity.findAll(
      { where: { repositoryId } },
      { transaction }
    );
    return Promise.each(activities, async it => {
      const payload = await this.migrateActivity(it);
      return it.update(payload, { transaction });
    });
  }

  async migrateActivity(activity) {
    const { repositoryId, type, data: metaInputs } = activity;
    const metaConfigs = get(this.metaByActivityType, type, []);
    const data = await migrateFileMeta(repositoryId, metaInputs, metaConfigs);
    return { data };
  }

  async migrateContentElements() {
    const { repositoryId, transaction } = this;
    const contentElements = await ContentElement.findAll(
      { where: { repositoryId } },
      { transaction }
    );
    return Promise.each(contentElements, async it => {
      const payload = await this.migrateContentElement(it);
      return it.update(payload, { transaction });
    });
  }

  async migrateContentElement(element) {
    const data = await this.migrateContentElementData(element);
    const meta = await this.migrateContentElementMeta(element);
    return { data, meta };
  }

  migrateContentElementData(element) {
    const { type, data } = element;
    if (type === 'IMAGE') return this.imageMigrationHandler(element);
    if (data.embeds) return this.embedsMigrationHandler(element);
    if (data.assets) return this.defaultMigrationHandler(element);
    return data;
  }

  async migrateContentElementMeta(element) {
    const { repositoryId, type } = element;
    const metaConfigs = get(this.metaByElementType, type, []);
    return migrateFileMeta(repositoryId, element.meta, metaConfigs);
  }

  async migrateRevisions() {
    const { repositoryId, transaction } = this;
    const options = {
      where: { repositoryId, entity: { [Op.in]: REVISION_TYPES } },
      transaction
    };
    const count = await Revision.count(options);
    const pages = Math.ceil(count / CHUNK_SIZE);
    return Promise.each(
      Array.from({ length: pages }, (_, i) => i + 1),
      page => this.migrateRevisionsChunk(page, options)
    );
  }

  async migrateRevisionsChunk(page, options) {
    const offset = (page - 1) * CHUNK_SIZE;
    const revisions = await Revision.findAll({
      ...options,
      offset,
      limit: CHUNK_SIZE
    });
    return Promise.each(revisions, async it => {
      const payload = await this.migrateRevision(it);
      return it.update(payload, { transaction: this.transaction });
    });
  }

  async migrateRevision(revision) {
    const { entity, state } = revision;
    const handler = mapEntityToAction[entity];
    const payload = await (this[handler] && this[handler](state));
    return { state: { ...state, ...payload } };
  }

  async imageMigrationHandler(element) {
    const { repositoryId, data } = element;
    const repositoryAssetsPath = storage.getPath(repositoryId);
    const url = get(data, 'url');
    if (!url) return data;
    const { key, newKey } = resolveNewURL(url, repositoryAssetsPath) || {};
    if (!key || !newKey) return data;
    await storage.copyFile(key, newKey);
    return { ...element.data, url: newKey };
  }

  async embedsMigrationHandler(element) {
    const { repositoryId, data } = element;
    const embeds = await this.getMigratedEmbeds(repositoryId, data.embeds);
    return { ...data, embeds };
  }

  getMigratedEmbeds(repositoryId, embeds) {
    return Promise.reduce(Object.entries(embeds), async (acc, [id, embed]) => {
      const payload = await this.migrateContentElement({ repositoryId, ...embed });
      return { ...acc, [id]: { ...embed, ...payload } };
    }, {});
  }

  async defaultMigrationHandler(element) {
    const { repositoryId, data } = element;
    const repositoryAssetsPath = storage.getPath(repositoryId);
    const updatedAssets = await Promise
      .filter(toPairs(data.assets), ([_, value]) => value.startsWith(protocol))
      .reduce(async (acc, [key, value]) => {
        const { key: oldKey, newKey } = resolveNewURL(value, repositoryAssetsPath) || {};
        if (!oldKey || !newKey) return { ...acc, [key]: value };
        await storage.copyFile(oldKey, newKey);
        return { ...acc, [key]: `${protocol}${newKey}` };
      }, {});
    return { ...element.data, assets: { ...element.data.assets, ...updatedAssets } };
  }
}

const migration = new Migration();
migration.initialize().then(() => {
  migration.run()
    .then(() => {
      console.info('Migration script was executed successfully.');
      process.exit(0);
    })
    .catch(error => {
      console.error(error.message);
      process.exit(1);
    });
});

function getFileMetas(schemas) {
  return schemas.reduce((acc, { id, meta, structure, elementMeta }) => {
    return {
      ...acc,
      [id]: {
        repositoryMeta: getFileMetaKeys(meta),
        metaByActivityType: getMetaByActivityType(structure),
        metaByElementType: getMetaByElementType(elementMeta)
      }
    };
  }, {});
}

function getMetaByActivityType(structure = []) {
  return structure.reduce((acc, { type, meta }) => ({
    ...acc,
    [type]: getFileMetaKeys(meta)
  }), {});
}

function getMetaByElementType(elementMeta = []) {
  return elementMeta.reduce((acc, { type, inputs }) => ({
    ...acc,
    [type]: getFileMetaKeys(inputs)
  }), {});
}

function getFileMetaKeys(meta = []) {
  return meta.filter(it => it.type === 'FILE').map(it => it.key);
}

async function migrateFileMeta(repositoryId, metaInputs, metaConfigs) {
  const repositoryAssetsPath = storage.getPath(repositoryId);
  const newMeta = await Promise.reduce(metaConfigs, async (acc, metaKey) => {
    const meta = get(metaInputs, metaKey);
    if (!meta) return acc;
    const url = get(meta, 'url');
    if (!url) return acc;
    const { key, newKey } = resolveNewURL(url, repositoryAssetsPath) || {};
    if (!key || !newKey) return acc;
    await storage.copyFile(key, newKey);
    return {
      ...acc,
      [metaKey]: {
        ...meta,
        key: newKey,
        url: `${protocol}${newKey}`,
        publicUrl: await storage.getFileUrl(newKey)
      }
    };
  }, {});
  return { ...metaInputs, ...newMeta };
}

function resolveNewURL(assetUrl, targetDir) {
  if (assetUrl.startsWith(protocol)) assetUrl = assetUrl.substr(protocol.length);
  const result = assetUrl.match(ASSET_PATH_REGEX);
  if (!result) return;
  const { groups: { directory, fileName } } = result;
  const newKey = path.join(targetDir, fileName);
  return { key: directory, newKey };
}
