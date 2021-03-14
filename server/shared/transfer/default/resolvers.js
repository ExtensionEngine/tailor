'use strict';

const { Activity, ContentElement, Repository } = require('../../database');
const mapKeys = require('lodash/mapKeys');
const miss = require('mississippi');
const QueryStream = require('pg-query-stream');
const { schema } = require('@tailor/config');
const { stringify } = require('JSONStream');

const reStorage = /^storage:\/\//;

const isString = arg => typeof arg === 'string';
const prependStorage = it => it.replace(/^(?!(?:storage:)?\/\/)(?=repository\/)/, 'storage://');

function createRepositoryResolver({ context, transaction }) {
  const where = { id: context.repositoryId };
  const srcStream = queryStream(Repository, { where, transaction });
  return miss.pipe(srcStream, stringify(false /* isArray */));
}

function createActivitiesResolver({ context, transaction }) {
  const where = { repositoryId: context.repositoryId };
  const srcStream = queryStream(Activity, { where, transaction });
  return miss.pipe(srcStream, stringify());
}

function createElementsResolver({ context, transaction }) {
  context.assets = context.assets || [];
  const where = { repositoryId: context.repositoryId };
  const srcStream = queryStream(ContentElement, { where, transaction });
  const assetParser = createAssetParser();
  assetParser.on('asset', asset => context.assets.push(asset));
  return miss.pipe(srcStream, assetParser, stringify());
}

function createManifestResolver({ context }) {
  const { assets, schemaId } = context;
  const manifest = {
    assets,
    schema: schema.getSchema(schemaId),
    date: new Date()
  };
  return miss.pipe(miss.from.obj([manifest]), stringify(false /* isArray */));
}

function createAssetResolver({ filename, storage }) {
  return storage.createReadStream(filename);
}

module.exports = {
  createRepositoryResolver,
  createActivitiesResolver,
  createElementsResolver,
  createManifestResolver,
  createAssetResolver
};

function createAssetParser(assets) {
  return miss.through.obj(function (element, _enc, cb) {
    element = element || {};
    const { data = {} } = element;
    const str = JSON.stringify(data);
    JSON.parse(str, (_, value) => {
      if (!isString(value)) return value;
      const [, asset] = prependStorage(value).split(reStorage);
      asset && this.emit('asset', asset);
      return value;
    });
    cb(null, element);
  });
}

function queryStream(Model, { where, transaction }) {
  where = mapKeys(where, (_, key) => Model.rawAttributes[key].field);
  const select = Model.queryGenerator.selectQuery(Model.tableName, { where });
  const stream = new QueryStream(select);
  return transaction.connection.query(stream);
}
