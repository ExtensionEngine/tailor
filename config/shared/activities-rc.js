const PREVIEW_URL = null;

const CONTENT_CONTAINERS = [{
  type: 'INTRO',
  label: 'Introduction',
  types: ['HTML', 'IMAGE', 'VIDEO'],
  displayHeading: true
}, {
  type: 'PAGE',
  label: 'Page'
}, {
  type: 'PERSPECTIVE',
  label: 'Perspective',
  multiple: true
}];

const SCHEMAS = [{
  id: 'DEFAULT_SCHEMA',
  name: 'Default schema',
  meta: [],
  structure: [{
    level: 1,
    type: 'COMPETENCY',
    subLevels: ['OBJECTIVE'],
    label: 'Competency',
    color: '#42A5F5',
    contentContainers: ['INTRO'],
    hasAssessments: false,
    hasExams: true,
    exams: { objectives: ['TOPIC'] },
    hasPrerequisites: true,
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { rules: { max: 250 } }
    }]
  }, {
    level: 2,
    type: 'OBJECTIVE',
    subLevels: ['TOPIC'],
    label: 'Learning Objective',
    color: '#66BB6A',
    contentContainers: [],
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
    level: 3,
    type: 'TOPIC',
    label: 'Topic',
    color: '#EC407A',
    isObjective: true,
    contentContainers: ['PERSPECTIVE'],
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
  }]
}];

module.exports = {
  CONTENT_CONTAINERS,
  PREVIEW_URL,
  SCHEMAS
};
