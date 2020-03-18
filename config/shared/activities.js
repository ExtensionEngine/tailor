'use strict';

const castArray = require('lodash/castArray');
const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const flatMap = require('lodash/flatMap');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const mergeConfig = require('../utils/mergeConfig');
const parseSchemas = require('./schema-parser');
const union = require('lodash/union');

/* eslint-disable require-sort/require-sort */
const defaultConfiguration = require('./activities-rc');
const customConfiguration = require('./activities-rc.load')();
/* eslint-enable */
if (!process.env.ENABLE_DEFAULT_SCHEMA && !isEmpty(customConfiguration)) {
  defaultConfiguration.SCHEMAS = [];
}

const { SCHEMAS } = mergeConfig(defaultConfiguration, customConfiguration);
parseSchemas(SCHEMAS);

module.exports = {
  SCHEMAS,
  getSchemaId,
  getSchema,
  getLevel: getActivityConfig,
  getOutlineLevels,
  getRepositoryMetadata,
  getActivityMetadata,
  getElementMetadata,
  getLevelRelationships,
  getRepositoryRelationships,
  getSiblingLevels,
  getSupportedContainers,
  hasAssessments: level => getActivityConfig(level).hasAssessments,
  isEditable: activityType => {
    const config = getActivityConfig(activityType);
    const hasContainers = !!getSupportedContainers(activityType).length;
    return hasContainers || config.hasAssessments;
  }
};

function getSchemaId(type) {
  return type.includes('/') && first(type.split('/'));
}

function getSchema(id) {
  const schema = find(SCHEMAS, { id });
  if (!schema) throw new Error('Schema does not exist!');
  return schema;
}

function getOutlineLevels(schemaId) {
  return getSchema(schemaId).structure;
}

function getActivityMetadata(activity = {}) {
  if (!activity.type) return [];
  const schemaId = getSchemaId(activity.type);
  return getMetadata(schemaId, activity, 'meta', 'data');
}

function getElementMetadata(schemaId, element) {
  if (!schemaId || !element) return { isEmpty: true };
  const inputs = getElementInputs(schemaId, element);
  const relationships = getElementRelationships(schemaId, element);
  return {
    isEmpty: !inputs.length && !relationships.length,
    inputs,
    relationships
  };
}

function getElementInputs(schemaId, element) {
  if (!schemaId || !element) return [];
  return getMetadata(schemaId, element, 'meta');
}

function getElementRelationships(schemaId, element) {
  if (!schemaId || !element) return [];
  return getMetadata(schemaId, element, 'relationships');
}

function getMetadata(schemaId, item, configKey = 'meta', storageKey = configKey) {
  const config = getConfig(schemaId, item);
  if (!config[configKey]) return [];
  return map(config[configKey], it => {
    const value = get(item, `${storageKey}.${it.key}`);
    return { ...it, value };
  });
}

// Get activity or content element config
function getConfig(schemaId, item = {}) {
  const { type, activityId } = item;
  if (!schemaId || !type) return {};
  const isElement = !!activityId;
  return isElement ? getElementConfig(schemaId, type) : getActivityConfig(type);
}

function getActivityConfig(type) {
  const schemaId = getSchemaId(type);
  if (!schemaId) return {};
  return schemaId && find(getOutlineLevels(schemaId), { type });
}

function getElementConfig(schemaId, type) {
  if (!schemaId) return {};
  const { elementMeta } = getSchema(schemaId);
  return find(elementMeta, it => castArray(it.type).includes(type)) || {};
}

function getSiblingLevels(type) {
  const schemaId = getSchemaId(type);
  if (!schemaId) return [{ type }];
  const levels = getOutlineLevels(schemaId);
  const { level } = find(levels, { type }) || {};
  if (!level) return [{ type }];
  return filter(levels, { level });
}

function getSupportedContainers(type) {
  const schema = getSchema(getSchemaId(type));
  const defaultConfig = get(defaultConfiguration, 'CONTENT_CONTAINERS', []);
  const schemaConfig = get(schema, 'contentContainers', []);
  const activityConfig = get(getActivityConfig(type), 'contentContainers', []);
  return map(activityConfig, type =>
    find(schemaConfig, { type }) || find(defaultConfig, { type })
  );
}

function getRepositoryMetadata(repository) {
  const config = get(getSchema(repository.schema), 'meta', []);
  return map(config, it => {
    const value = get(repository, `data.${it.key}`);
    return { ...it, value };
  });
}

function getLevelRelationships(type) {
  return get(getActivityConfig(type), 'relationships', []);
}

function getRepositoryRelationships(schemaId) {
  const structure = getOutlineLevels(schemaId);
  return flatMap(structure, it => it.relationships)
    .reduce((acc, { type }) => union(acc, [type]), []);
}
