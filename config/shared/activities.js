const filter = require('lodash/filter');
const find = require('lodash/find');
const first = require('lodash/first');
const mergeConfig = require('../utils/mergeConfig');
const config = mergeConfig(
  require('./activities-rc'),
  require('./activities-rc.load')()
);

const { SCHEMAS, ASSET_GROUP, PREVIEW_URL } = config;

module.exports = {
<<<<<<< HEAD
  SCHEMAS,
=======
>>>>>>> 72850f0f899a7be869e133613d81b2f3caa70292
  OUTLINE_LEVELS: SCHEMAS[0].structure,
  OBJECTIVES: filter(SCHEMAS[0].structure, { isObjective: true }),
  ASSET_GROUP,
  PREVIEW_URL,
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

function getLevel(type) {
  // If schema is not provided, assume legacy structure (single schema)
  // and pick first
  const schemaId = type.includes('/') ? first(type.split('/')) : first(SCHEMAS).id;
  return find(getOutlineLevels(schemaId), { type });
}
