'use strict';

const castArray = require('lodash/castArray');
const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const flatMap = require('lodash/flatMap');
const get = require('lodash/get');
const isString = require('lodash/isString');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const sortBy = require('lodash/sortBy');
const union = require('lodash/union');
const uniq = require('lodash/uniq');

module.exports = (schemas, defaultConfiguration) => {
  return {
    getSchemaId,
    getSchema,
    getLevel: getActivityConfig,
    getOutlineLevels,
    isOutlineActivity,
    getOutlineChildren,
    isTrackedInWorkflow,
    getRepositoryMetadata,
    getActivityLabel,
    getActivityMetadata,
    getElementMetadata,
    getLevelRelationships,
    getRepositoryRelationships,
    getSiblingTypes,
    getSupportedContainers,
    getContainerTemplateId,
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
    const schema = find(schemas, { id });
    if (!schema) throw new Error('Schema does not exist!');
    return schema;
  }

  function getOutlineLevels(schemaId) {
    return getSchema(schemaId).structure;
  }

  function isOutlineActivity(type) {
    const schema = getSchemaId(type);
    if (!schema) return false;
    return !!find(getOutlineLevels(schema), { type });
  }

  function isTrackedInWorkflow(type) {
    const schema = getSchemaId(type);
    if (!schema) return false;
    const activity = find(getOutlineLevels(schema), { type });
    return activity && activity.isTrackedInWorkflow;
  }

  function getActivityLabel(activity) {
    return getActivityConfig(activity.type).label;
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
    return getMetadata(schemaId, element, 'inputs', 'meta');
  }

  function getElementRelationships(schemaId, element) {
    if (!schemaId || !element) return [];
    return getMetadata(schemaId, element, 'relationships', 'refs');
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
    const { id, activityId, type } = item;
    if (!schemaId || !type) return {};
    const isElement = !!activityId || isString(id);
    return isElement ? getElementConfig(schemaId, type) : getActivityConfig(type);
  }

  function getActivityConfig(type) {
    const schemaId = getSchemaId(type);
    return schemaId ? find(getOutlineLevels(schemaId), { type }) : {};
  }

  function getOutlineChildren(activities, parentId) {
    const children = sortBy(filter(activities, { parentId }), 'position');
    if (!parentId || !children.length) return children;
    const parentType = find(activities, { id: parentId }).type;
    const types = getActivityConfig(parentType).subLevels;
    return filter(children, it => types.includes(it.type));
  }

  function getElementConfig(schemaId, type) {
    if (!schemaId) return {};
    // tesMeta used to support legacy config
    const { elementMeta, tesMeta } = getSchema(schemaId);
    if (!elementMeta && !tesMeta) return {};
    const config = elementMeta || map(tesMeta, it => ({ ...it, inputs: it.meta }));
    return find(config, it => castArray(it.type).includes(type)) || {};
  }

  function getSiblingTypes(type) {
    if (!isOutlineActivity(type)) return [type];
    const schemaId = getSchemaId(type);
    const outline = getOutlineLevels(schemaId);
    const activityConfig = getActivityConfig(type);
    const isRootLevel = activityConfig.rootLevel;
    return uniq(reduce(outline, (acc, it) => {
      if (isRootLevel && it.rootLevel) acc.push(it.type);
      if (!it.subLevels || !it.subLevels.includes(type)) return acc;
      return [...acc, ...it.subLevels];
    }, []));
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

  // type is checked because of legacy support
  function getContainerTemplateId(container) {
    return container.templateId || container.type;
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
};
