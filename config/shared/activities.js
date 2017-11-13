const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const map = require('lodash/map');
const mergeConfig = require('../utils/mergeConfig');
const config = mergeConfig(
  require('./activities-rc'),
  require('./activities-rc.load')()
);

const { SCHEMAS, ASSET_GROUP, PREVIEW_URL } = config;

// Validate schemas
// Prefix activity types with schema id; SCHEMA_ID/TYPE
// Add name meta to each activity config
SCHEMAS.forEach(schema => {
  validateSchema(schema);
  schema.meta = schema.meta || [];
  const hasColorMeta = find(schema.meta, { key: 'color' });
  if (!hasColorMeta) {
    schema.meta.push({ type: 'COLOR', key: 'color', label: 'Color' });
  }
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
  });
});

module.exports = {
  SCHEMAS,
  OUTLINE_LEVELS: SCHEMAS[0].structure,
  OBJECTIVES: filter(SCHEMAS[0].structure, { isObjective: true }),
  ASSET_GROUP,
  PREVIEW_URL,
  getSchema,
  getRepositoryMeta,
  getOutlineLevels,
  getLevel,
  isEditable: type => {
    const level = getLevel(type);
    return level && level.isEditable;
  },
  hasIntroduction: level => getLevel(level).hasIntroduction,
  hasPerspectives: level => getLevel(level).hasPerspectives,
  hasAssessments: level => getLevel(level).hasAssessments,
  hasExams: level => getLevel(level).hasExams
};

function getOutlineLevels(schemaId) {
  // If schema is not provided, assume legacy structure (single schema)
  // and pick first
  const schema = schemaId ? find(SCHEMAS, { id: schemaId }) : first(SCHEMAS);
  return schema.structure;
}

function getSchema(id) {
  return find(SCHEMAS, { id });
};

function getRepositoryMeta(repository) {
  const config = get(getSchema(repository.schema), 'meta', []);
  return map(config, it => {
    let value = get(repository, `data.${it.key}`);
    return { ...it, value };
  });
};

function getLevel(type) {
  // If schema is not provided, assume legacy structure (single schema)
  // and pick first
  const schemaId = type.includes('/') ? first(type.split('/')) : first(SCHEMAS).id;
  return find(getOutlineLevels(schemaId), { type });
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
