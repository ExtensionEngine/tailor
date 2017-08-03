const filter = require('lodash/filter');
const find = require('lodash/find');
const mergeConfig = require('../utils/mergeConfig');
const config = mergeConfig(
  require('./activitiesrc'),
  require('./activitiesrc.load')()
);
const { OUTLINE_LEVELS, ASSET_GROUP } = config;

module.exports = {
  OUTLINE_LEVELS,
  OBJECTIVES: filter(OUTLINE_LEVELS, { isObjective: true }),
  ASSET_GROUP,
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

function getLevel(type) {
  return find(OUTLINE_LEVELS, { type });
}
