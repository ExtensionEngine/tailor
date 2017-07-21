const filter = require('lodash/filter');
const find = require('lodash/find');

const ASSET_GROUP = 'PERSPECTIVE';
const OUTLINE_LEVELS = [{
  level: 1,
  type: 'GOAL',
  subLevels: ['OBJECTIVE'],
  label: 'Goal',
  color: '#42A5F5',
  isEditable: true,
  hasIntroduction: true,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: true,
  hasPrerequisites: true,
  meta: [
    {
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { rules: { required: false, max: 250 } }
    }
  ]
}, {
  level: 2,
  type: 'OBJECTIVE',
  subLevels: ['TOPIC'],
  label: 'Learning Objective',
  color: '#66BB6A',
  isEditable: false,
  hasIntroduction: false,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: false,
  hasPrerequisites: true,
  meta: [
    {
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { rules: { required: false, max: 250 } }
    }
  ]
}, {
  level: 3,
  type: 'TOPIC',
  label: 'Topic',
  color: '#EC407A',
  isEditable: true,
  isObjective: true,
  hasIntroduction: false,
  hasPerspectives: true,
  hasAssessments: true,
  hasExams: false,
  hasPrerequisites: true,
  meta: [
    {
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { rules: { required: false, max: 250 } }
    }
  ]
}];

function getLevel(type) {
  return find(OUTLINE_LEVELS, { type });
}

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
