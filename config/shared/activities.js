const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const mergeConfig = require('../utils/mergeConfig');
const transform = require('lodash/transform');

const defaultConfiguration = require('./activities-rc');
const customConfiguration = require('./activities-rc.load')();

if (!process.env.ENABLE_SEED_SCHEMA && !isEmpty(customConfiguration)) {
  defaultConfiguration.SCHEMAS = [];
}

const config = mergeConfig(defaultConfiguration, customConfiguration);
const { SCHEMAS, CONTENT_CONTAINERS, PREVIEW_URL } = config;

// Validate schemas
// Prefix activity types with schema id; SCHEMA_ID/TYPE
// Add name meta to each activity config
SCHEMAS.forEach(schema => {
  validateSchema(schema);
  schema.meta = schema.meta || [];
  const hasColorMeta = find(schema.meta, { key: 'color' });
  if (!hasColorMeta) {
    schema.meta.push({ type: 'COLOR', key: 'color', label: 'Label color' });
  }
  schema.defaultMeta = getMetaDefaults(schema.meta);
  return schema.structure.forEach(it => {
    it.type = `${schema.id}/${it.type}`;
    it.subLevels = map(it.subLevels, type => `${schema.id}/${type}`);
    it.meta = it.meta || [];
    const hasNameMeta = find(it.meta, { key: 'name' });
    if (!hasNameMeta) {
      it.meta.unshift({
        key: 'name',
        type: 'TEXTAREA',
        label: 'Name',
        placeholder: 'Click to add...',
        validate: { rules: { max: 250, required: true } }
      });
    }
    it.defaultMeta = getMetaDefaults(it.meta);
    if (it.hasExams && get(it, 'exams.objectives')) {
      it.exams.objectives = map(it.exams.objectives, it => `${schema.id}/${it}`);
    }
  });
});

module.exports = {
  SCHEMAS,
  CONTENT_CONTAINERS,
  PREVIEW_URL,
  getSchema,
  getSchemaId,
  getRepositoryMeta,
  getOutlineLevels,
  getObjectives,
  getLevel,
  isEditable: activityType => {
    const config = getLevel(activityType);
    const hasContainers = !!getSupportedContainers(activityType).length;
    return hasContainers || config.hasExams || config.hasAssessments;
  },
  getSupportedContainers,
  hasAssessments: level => getLevel(level).hasAssessments,
  hasExams: level => getLevel(level).hasExams
};

function getOutlineLevels(schemaId) {
  // If schema is not provided, assume legacy structure (single schema)
  // and pick first
  const schema = schemaId
    ? find(SCHEMAS, { id: schemaId }) || first(SCHEMAS)
    : first(SCHEMAS);
  return schema.structure;
}

function getSchema(id) {
  return find(SCHEMAS, { id });
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
  return filter(getSchema(schemaId).structure, { isObjective: true });
}

function getRepositoryMeta(repository) {
  const config = get(getSchema(repository.schema), 'meta', []);
  return map(config, it => {
    let value = get(repository, `data.${it.key}`);
    return { ...it, value };
  });
}

function getLevel(type) {
  return find(getOutlineLevels(getSchemaId(type)), { type });
}

function getSchemaId(type) {
  return type.includes('/') && first(type.split('/'));
}

function validateSchema(schema) {
  const schemaMandatoryProps = ['id', 'name'];
  schemaMandatoryProps.forEach(prop => {
    if (!schema[prop]) throw new Error(`Schema must have ${prop}!`);
  });
  if (isEmpty(schema.structure)) throw new Error('Schema structure missing!');
  const activityMandatoryProps = ['level', 'type', 'label', 'color'];
  schema.structure.forEach(it => {
    activityMandatoryProps.forEach(prop => {
      if (!it[prop]) throw new Error(`Activity config must have ${prop}!`);
    });
  });
}

function getMetaDefaults(meta) {
  return transform(meta, (acc, it) => {
    if (it.defaultValue) acc[it.key] = it.defaultValue;
  }, {});
}
