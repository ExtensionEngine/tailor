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
    type: 'COMPETENCY',
    rootLevel: true,
    subLevels: ['OBJECTIVE'],
    label: 'Competency',
    color: '#42A5F5',
    contentContainers: ['INTRO', 'EXAM'],
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
    type: 'OBJECTIVE',
    subLevels: ['TOPIC'],
    label: 'Learning Objective',
    color: '#66BB6A',
    contentContainers: [],
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
    type: 'TOPIC',
    label: 'Topic',
    color: '#EC407A',
    isObjective: true,
    contentContainers: ['PERSPECTIVE', 'ASSESSMENT_POOL'],
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
  contentContainers: [{
    type: 'EXAM',
    templateId: 'EXAM',
    label: 'Exam',
    displayHeading: true,
    multiple: true,
    required: false,
    publishedAs: 'exam',
    config: {
      objectives: ['DEFAULT_SCHEMA/TOPIC']
    }
  }, {
    type: 'ASSESSMENT_POOL',
    templateId: 'ASSESSMENT_POOL',
    label: 'Assessments',
    publishedAs: 'assessments'
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
