const find = require('lodash/find');
const get = require('lodash/get');
const map = require('lodash/map');
const transform = require('lodash/transform');
const validate = require('./schema-validation');

// Validate schemas
// Prefix activity types with schema id; SCHEMA_ID/TYPE
// Process meta
module.exports = async function parse(schemas = []) {
  await validate(schemas);
  schemas.forEach(schema => {
    processRepositoryConfig(schema);
    schema.structure.forEach(it => processActivityConfig(schema, it));
  });
};

function processRepositoryConfig(schema) {
  schema.meta = get(schema, 'meta', []);
  const hasColorMeta = find(schema.meta, { key: 'color' });
  if (!hasColorMeta) {
    schema.meta.push({ type: 'COLOR', key: 'color', label: 'Label color' });
  }
  schema.defaultMeta = getMetaDefaults(schema.meta);
}

function processActivityConfig(schema, activity) {
  activity.type = processType(schema, activity.type);
  activity.subLevels = map(activity.subLevels, type => processType(schema, type));
  activity.meta = get(activity, 'meta', []);
  const hasNameMeta = find(activity.meta, { key: 'name' });
  if (!hasNameMeta) {
    activity.meta.unshift({
      key: 'name',
      type: 'TEXTAREA',
      label: 'Name',
      placeholder: 'Click to add...',
      validate: { rules: { max: 250, required: true } }
    });
  }
  activity.defaultMeta = getMetaDefaults(activity.meta);
  const examObjectives = get(activity, 'exams.objectives');
  if (examObjectives) {
    activity.exams.objectives = map(examObjectives, it => processType(schema, it));
  }
}

function processType(schema, type) {
  return `${schema.id}/${type}`;
}

function getMetaDefaults(meta) {
  return transform(meta, (acc, it) => {
    if (it.defaultValue) acc[it.key] = it.defaultValue;
  }, {});
}
