'use strict';

const find = require('lodash/find');
const get = require('lodash/get');
const map = require('lodash/map');
const transform = require('lodash/transform');
const validate = require('./schema-validation');

const LABEL_COLORS = [
  ['#F44336', '#E91E63'],
  ['#9C27B0', '#673AB7'],
  ['#3F51B5', '#2196F3'],
  ['#03A9F4', '#00BCD4'],
  ['#009688', '#4CAF50'],
  ['#FF9800', '#FF5722']
];

// Validate schemas
// Prefix activity types with schema id; SCHEMA_ID/TYPE
// Process meta
module.exports = function parse(schemas = []) {
  validate(schemas);
  schemas.forEach(schema => {
    processRepositoryConfig(schema);
    schema.structure.forEach(it => processActivityConfig(schema, it));
  });
};

function processRepositoryConfig(schema) {
  schema.meta = get(schema, 'meta', []);
  const hasColorMeta = find(schema.meta, { key: 'color' });
  if (!hasColorMeta) {
    schema.meta.push({
      type: 'COLOR', key: 'color', label: 'Label color', colors: LABEL_COLORS
    });
  }
  schema.defaultMeta = getMetaDefaults(schema.meta);
}

function processActivityConfig(schema, activity) {
  activity.type = processType(schema, activity.type);
  activity.subLevels = map(activity.subLevels, type => processType(schema, type));
  activity.relationships = processActivityRelationships(activity);
  activity.meta = get(activity, 'meta', []);
  const hasNameMeta = find(activity.meta, { key: 'name' });
  if (!hasNameMeta) {
    activity.meta.unshift({
      key: 'name',
      type: 'TEXTAREA',
      label: 'Name',
      placeholder: 'Click to add...',
      validate: { max: 250, required: true }
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

function processActivityRelationships(activity) {
  const { hasPrerequisites, relationships = [] } = activity;
  if (hasPrerequisites && !find(relationships, { type: 'prerequisites' })) {
    relationships.unshift({
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    });
  }
  return relationships;
}
