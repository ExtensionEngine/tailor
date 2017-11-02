const ASSET_GROUP = 'PERSPECTIVE';
const PREVIEW_URL = 'https://cgma.dev.extensionengine.com/admin/#/course/{courseId}/activity/{activityId}/preview';

const COURSE_OUTLINE = [{
  level: 1,
  type: 'GOAL',
  subLevels: ['OBJECTIVE', 'INTERACTIVE_EXERCISE'],
  label: 'Goal',
  color: '#42A5F5',
  isEditable: true,
  hasIntroduction: true,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: true,
  hasPrerequisites: true,
  meta: [{
    key: 'description',
    type: 'TEXTAREA',
    label: 'Description',
    placeholder: 'Click to add...',
    validate: { rules: { max: 250 } }
  }, {
    key: 'examSeriesCode',
    type: 'INPUT',
    label: 'Exam Series Code',
    placeholder: 'Click to add...',
    validate: { rules: { max: 30 } }
  }]
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
  meta: [{
    key: 'description',
    type: 'TEXTAREA',
    label: 'Description',
    placeholder: 'Click to add...',
    validate: { rules: { required: false, max: 250 } }
  }]
}, {
  level: 2,
  type: 'INTERACTIVE_EXERCISE',
  subLevels: [],
  label: 'Interactive Exercise',
  color: '#78909C',
  isEditable: true,
  hasPerspectives: true,
  hasPrerequisites: true,
  meta: []
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
  meta: [{
    key: 'description',
    type: 'TEXTAREA',
    label: 'Description',
    placeholder: 'Click to add...',
    validate: { rules: { required: false, max: 250 } }
  }]
}];

const REPOSITORY_OUTLINE = [{
  level: 1,
  type: 'GROUP',
  label: 'Group',
  color: '#42A5F5',
  isEditable: true,
  hasIntroduction: true,
  hasPerspectives: false,
  hasAssessments: false,
  hasExams: true,
  meta: []
}];

const SCHEMAS = [
  { id: 'COURSE', name: 'Course', structure: COURSE_OUTLINE },
  { id: 'REPOSITORY', name: 'Repository', structure: REPOSITORY_OUTLINE }
];

module.exports = {
  ASSET_GROUP,
  SCHEMAS,
  PREVIEW_URL
};
