'use strict';

const {
  Activity,
  ContentElement,
  Repository,
  Revision,
  sequelize
} = require('../shared/database');
const cloneFileMeta = require('../shared/util/cloneFileMeta');
const get = require('lodash/get');
const getFileMetas = require('../shared/util/getFileMetas');
const Listr = require('listr');
const Promise = require('bluebird');
const { protocol } = require('../../config/server/storage');
const resolveNewURL = require('../shared/util/resolveNewURL');
const { SCHEMAS } = require('../../config/shared/activities');
const storage = require('../repository/storage');
const toPairs = require('lodash/toPairs');

const CHUNK_SIZE = 2000;
const IMAGE_ELEMENT_TYPE = 'IMAGE';

const ENTITIES = {
  REPOSITORY: 'REPOSITORY',
  ACTIVITY: 'ACTIVITY',
  CONTENT_ELEMENT: 'CONTENT_ELEMENT'
};

const mapEntityToAction = {
  [ENTITIES.REPOSITORY]: 'migrateRepository',
  [ENTITIES.ACTIVITY]: 'migrateActivity',
  [ENTITIES.CONTENT_ELEMENT]: 'migrateContentElement'
};

migrate()
  .then(() => {
    console.info('Migration script was executed successfully.');
    process.exit(0);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });

async function migrate() {
  const transaction = await sequelize.transaction();
  const tasks = await getTasks(transaction);
  return tasks.run().then(() => transaction.commit());
}

async function getTasks(transaction) {
  const repositories = await Repository.findAll({ transaction });
  const metaBySchemaType = getFileMetas(SCHEMAS);
  const tasks = repositories.map(repository => ({
    title: `Migrate repository "${repository.name}"`,
    task: () => {
      const fileMetaByEntity = metaBySchemaType[repository.schema];
      const repositoryMigration = new RepositoryMigration({ repository, fileMetaByEntity, transaction });
      return repositoryMigration.getTasks();
    }
  }));
  return new Listr(tasks);
}

class RepositoryMigration {
  constructor({ repository, fileMetaByEntity, transaction }) {
    this.repository = repository;
    this.fileMetaByEntity = fileMetaByEntity;
    this.transaction = transaction;
    this.repositoryAssetsPath = storage.getPath(repository.id);
  }

  get repositoryMeta() {
    return this.fileMetaByEntity.repository;
  }

  get metaByActivityType() {
    return this.fileMetaByEntity.activity;
  }

  get metaByElementType() {
    return this.fileMetaByEntity.element;
  }

  get repositoryId() {
    return this.repository.id;
  }

  getTasks() {
    return new Listr([{
      title: 'Migrate repository',
      task: () => this.migrateRepositoryAssets()
    }, {
      title: 'Migrate activities',
      task: () => this.migrateActivities()
    }, {
      title: 'Migrate content elements',
      task: () => this.migrateContentElements()
    }]);
  }

  async migrateRepositoryAssets() {
    if (!this.repositoryMeta.length) return;
    await this.migrateRevisions(ENTITIES.REPOSITORY);
    const payload = await this.migrateRepository();
    return this.repository.update(payload, { transaction: this.transaction });
  }

  async migrateRepository() {
    const { repository, repositoryMeta: metaConfigs } = this;
    const data = await cloneFileMeta(repository.data, metaConfigs, this.repositoryAssetsPath);
    return { data };
  }

  async migrateActivities() {
    const { repositoryId, transaction } = this;
    const types = Object.keys(this.metaByActivityType);
    if (!types.length) return;
    await this.migrateRevisions(ENTITIES.ACTIVITY);
    const activities = await Activity.findAll(
      { where: { repositoryId, type: types } },
      { transaction }
    );
    return Promise.each(activities, async it => {
      const payload = await this.migrateActivity(it);
      return it.update(payload, { transaction });
    });
  }

  async migrateActivity(activity) {
    const { type, data: metaInputs } = activity;
    const metaConfigs = get(this.metaByActivityType, type, []);
    const data = await cloneFileMeta(metaInputs, metaConfigs, this.repositoryAssetsPath);
    return { data };
  }

  async migrateContentElements() {
    const { repositoryId, transaction } = this;
    await this.migrateRevisions(ENTITIES.CONTENT_ELEMENT);
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

  async migrateContentElementData(element) {
    const { type, data } = element;
    if (type === IMAGE_ELEMENT_TYPE) return this.imageMigrationHandler(element);
    const embeds = data.embeds && (await this.embedsMigrationHandler(element));
    const assets = data.assets && (await this.defaultMigrationHandler(element));
    return { ...data, ...embeds, ...assets };
  }

  async migrateContentElementMeta(element) {
    const { type, meta: metaInputs } = element;
    const metaConfigs = get(this.metaByElementType, type, []);
    return this.migrateFileMeta(metaInputs, metaConfigs);
  }

  async migrateRevisions(entity) {
    const { repositoryId, transaction } = this;
    const options = {
      where: { repositoryId, entity },
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

  async imageMigrationHandler({ data }) {
    const url = get(data, 'url');
    if (!url) return data;
    const { key, newKey } = resolveNewURL(url, this.repositoryAssetsPath) || {};
    if (!key || !newKey) return data;
    await storage.copyFile(key, newKey);
    return { ...data, url: newKey };
  }

  async embedsMigrationHandler(element) {
    const { repositoryId, data } = element;
    const embeds = await Promise.reduce(Object.entries(data.embeds), async (acc, [id, embed]) => {
      const payload = await this.migrateContentElement({ repositoryId, ...embed });
      return { ...acc, [id]: { ...embed, ...payload } };
    }, {});
    return { embeds };
  }

  async defaultMigrationHandler({ data }) {
    const updatedAssets = await Promise
      .filter(toPairs(data.assets), ([_, value]) => value.startsWith(protocol))
      .reduce(async (acc, [key, value]) => {
        const { key: oldKey, newKey } = resolveNewURL(value, this.repositoryAssetsPath) || {};
        if (!oldKey || !newKey) return { ...acc, [key]: value };
        await storage.copyFile(oldKey, newKey);
        return { ...acc, [key]: `${protocol}${newKey}` };
      }, {});
    return { assets: { ...data.assets, ...updatedAssets } };
  }
}
