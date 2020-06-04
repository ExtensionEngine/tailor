'use strict';

const yup = require('yup');

const activityType = yup.string().min(2).max(50);

const meta = yup.array().of(yup.object().shape({
  key: yup.string().min(2).max(50).required(),
  type: yup.string().min(2).max(30).required(),
  label: yup.string().min(2).max(50).required(),
  placeholder: yup.string().min(2).max(100),
  validate: yup.object()
}));

const relationships = yup.array().of(yup.object().shape({
  type: yup.string().min(2).max(100).required(),
  label: yup.string().min(2).max(100).required(),
  placeholder: yup.string().min(2).max(100),
  multiple: yup.boolean(),
  searchable: yup.boolean(),
  allowEmpty: yup.boolean(),
  allowCircularLinks: yup.boolean(),
  allowInsideLineage: yup.boolean(),
  allowedTypes: yup.array().of(activityType)
}));

const schema = yup.object().shape({
  id: yup.string().min(2).max(20).required(),
  name: yup.string().min(2).max(200).required(),
  meta,
  workflowId: yup.string(),
  structure: yup.array().of(yup.object().shape({
    level: yup.number().integer().min(1).max(10).required(),
    type: activityType.required(),
    label: yup.string().min(2).max(100).required(),
    color: yup.string().matches(/^#(?:[0-9a-fA-F]{3}){1,2}$/).required(),
    subLevels: yup.array().of(activityType),
    isObjective: yup.boolean(),
    contentContainers: yup.array().of(activityType),
    hasAssessments: yup.boolean(),
    hasExams: yup.boolean(),
    isTrackedInWorkflow: yup.boolean(),
    exams: yup.object().shape({ objectives: yup.array().of(activityType) }),
    relationships,
    meta
  })).min(1),
  contentContainers: yup.array().of(yup.object().shape({
    type: yup.string().min(2).max(50).required(),
    label: yup.string().min(2).max(100).required(),
    types: yup.array().of(yup.string().min(2).max(20)),
    multiple: yup.boolean(),
    displayHeading: yup.boolean()
  }))
});

const schemas = yup.array().of(schema).min(1);

module.exports = function (config) {
  try {
    schemas.validateSync(config);
  } catch (err) {
    console.error('Invalid schema config!', err.message);
    throw err;
  }
};
