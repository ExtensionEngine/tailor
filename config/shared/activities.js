'use strict';

const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const flatMap = require('lodash/flatMap');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const last = require('lodash/last');
const map = require('lodash/map');
const mergeConfig = require('../utils/mergeConfig');
const parseSchemas = require('./schema-parser');
const sortBy = require('lodash/sortBy');
const union = require('lodash/union');

const defaultConfiguration = require('./activities-rc');
const customConfiguration = require('./activities-rc.load')();
if (!process.env.ENABLE_DEFAULT_SCHEMA && !isEmpty(customConfiguration)) {
  defaultConfiguration.SCHEMAS = [];
}

const { SCHEMAS } = mergeConfig(defaultConfiguration, customConfiguration);
parseSchemas(SCHEMAS);

module.exports = {
  SCHEMAS,
  getSchema,
  getSchemaId,
  getRepositoryMeta,
  getLevelRelationships,
  getRepositoryRelationships,
  getOutlineLevels,
  getObjectives,
  getLevel,
  getTesMeta,
  getSiblingLevels,
  isEditable: activityType => {
    const config = getLevel(activityType);
    const hasContainers = !!getSupportedContainers(activityType).length;
    return hasContainers || config.hasExams || config.hasAssessments;
  },
  getSupportedContainers,
  hasAssessments: level => getLevel(level).hasAssessments,
  hasExams: level => getLevel(level).hasExams
};

function getSchema(id) {
  const schema = find(SCHEMAS, { id });
  if (!schema) throw new Error('Schema does not exist!');
  return schema;
}

function getSchemaId(type) {
  return type.includes('/') && first(type.split('/'));
}

function getOutlineLevels(schemaId) {
  return getSchema(schemaId).structure;
}

function getLevel(type) {
  const schemaId = getSchemaId(type);
  return schemaId && find(getOutlineLevels(schemaId), { type });
}

function getTesMeta(schemaId, type) {
  return find(getSchema(schemaId).tesMeta, { type }) || {};
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
  const activityConfig = get(getLevel(type), 'contentContainers', []);
  return map(activityConfig, type =>
    find(schemaConfig, { type }) || find(defaultConfig, { type })
  );
}

function getObjectives(schemaId) {
  const schema = getSchema(schemaId);
  const objectives = filter(schema.structure, { isObjective: true });
  return objectives.length
    ? objectives
    : [last(sortBy(schema.structure, 'level'))];
}

function getRepositoryMeta(repository) {
  const config = get(getSchema(repository.schema), 'meta', []);
  return map(config, it => {
    const value = get(repository, `data.${it.key}`);
    return { ...it, value };
  });
}

function getLevelRelationships(type) {
  return get(getLevel(type), 'relationships', []);
}

function getRepositoryRelationships(schemaId) {
  const structure = getOutlineLevels(schemaId);
  return flatMap(structure, it => it.relationships)
    .reduce((acc, { type }) => union(acc, [type]), []);
}
