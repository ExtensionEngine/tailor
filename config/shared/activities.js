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
  OUTLINE_LEVELS: SCHEMAS[0].structure,
  OBJECTIVES: filter(SCHEMAS[0].structure, { isObjective: true }),
  ASSET_GROUP,
  PREVIEW_URL,
  getLevel,
  isEditable: type => {
    const level = getLevel(type);
    return level && level.isEditable;
  },
  hasIntroduction: level => getLevel(level).hasIntroduction,
  hasPerspectives: level => getLevel(level).hasPerspectives,
  hasAssessments: level => getLevel(level).hasAssessments,
  hasExams: level => getLevel(level).hasExams,
  getOutlineLevels(schemaId) {
    const schema = schemaId ? find(SCHEMAS, { id: schemaId }) : first(SCHEMAS);
    return schema.structure;
  }
};

function getLevel(type) {
  return find(SCHEMAS[0].structure, { type });
}
