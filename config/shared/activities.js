const find = require('lodash/find');
const isNumber = require('lodash/isNumber');

const ASSET_GROUP = 'PERSPECTIVE';
const OUTLINE_LEVELS = [{
  type: 'GOAL',
  label: 'Goal',
  color: '#42A5F5',
  isEditable: true,
  hasIntroduction: true,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: true
}, {
  type: 'OBJECTIVE',
  label: 'Learning Objective',
  color: '#66BB6A',
  isEditable: false,
  hasIntroduction: false,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: false
}, {
  type: 'TOPIC',
  label: 'Topic',
  color: '#EC407A',
  isEditable: true,
  hasIntroduction: false,
  hasPerspectives: true,
  hasAssessments: true,
  hasExams: false
}];

function getLevel(level) {
  return isNumber(level)
    ? OUTLINE_LEVELS[level - 1]
    : find(OUTLINE_LEVELS, { type: level });
}

module.exports = {
  OUTLINE_LEVELS,
  ASSET_GROUP,
  getLevel,
  isEditable: level => getLevel(level).isEditable,
  hasIntroduction: level => getLevel(level).hasIntroduction,
  hasPerspectives: level => getLevel(level).hasPerspectives,
  hasAssessments: level => getLevel(level).hasAssessments,
  hasExams: level => getLevel(level).hasExams
};
