'use strict';

const CONTENT_CONTAINERS = [{
  type: 'INTRO',
  label: 'Introduction',
  types: ['JODIT_HTML', 'IMAGE', 'VIDEO', 'HTML'],
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
  name: 'Sample course',
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
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { max: 250 }
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
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { required: false, max: 250 }
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
    relationships: [{
      type: 'prerequisites',
      label: 'Prerequisites',
      placeholder: 'Select prerequisites'
    }],
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description',
      placeholder: 'Click to add...',
      validate: { required: false, max: 250 }
    }]
  }],
  elementMeta: [{
    type: 'ASSESSMENT',
    label: 'Assessment',
    meta: [{
      key: 'description',
      type: 'TEXTAREA',
      label: 'Description'
    }]
  }]
}];

module.exports = {
  CONTENT_CONTAINERS,
  SCHEMAS
};
