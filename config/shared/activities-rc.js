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

const COURSE_OUTLINE = [{
  level: 1,
  type: 'COMPETENCY',
  subLevels: ['OBJECTIVE'],
  label: 'Competency',
  color: '#42A5F5',
  isEditable: true,
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
  isEditable: false,
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
  isEditable: true,
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
}];

const REPOSITORY_OUTLINE = [{
  level: 1,
  type: 'GROUP',
  label: 'Group',
  color: '#42A5F5',
  isEditable: true,
  contentContainers: ['INTRO'],
  hasAssessments: false,
  hasExams: true,
  meta: []
}];

const SCHEMAS = [{
  id: 'EXAMPLE_SCHEMA',
  name: 'Example Schema 1',
  structure: COURSE_OUTLINE,
  meta: []
}, {
  id: 'EXAMPLE_SCHEMA_2',
  name: 'Example Schema 2',
  structure: REPOSITORY_OUTLINE
}];

module.exports = {
  CONTENT_CONTAINERS,
  SCHEMAS,
  PREVIEW_URL
};
