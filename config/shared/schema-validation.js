const Joi = require('joi');
const Promise = require('bluebird');
const validate = Promise.promisify(Joi.validate);

const activityType = Joi.string().min(2).max(50);

const meta = Joi.array().items(Joi.object().keys({
  key: Joi.string().min(2).max(50).required(),
  type: Joi.string().min(2).max(30).required(),
  label: Joi.string().min(2).max(50).required(),
  placeholder: Joi.string().min(2).max(100),
  validate: Joi.object().keys({ rules: Joi.object() })
}));

const repository = Joi.object().keys({
  id: Joi.string().min(2).max(20).required(),
  name: Joi.string().min(2).max(200).required(),
  meta,
  structure: Joi.array().items(Joi.object().keys({
    level: Joi.number().integer().min(1).max(10).required(),
    type: activityType.required(),
    label: Joi.string().min(2).max(100).required(),
    color: Joi.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).required(),
    subLevels: Joi.array().items(activityType),
    hasPrerequisites: Joi.boolean(),
    isObjective: Joi.boolean(),
    contentContainers: Joi.array().items(activityType),
    hasAssessments: Joi.boolean(),
    hasExams: Joi.boolean(),
    exams: Joi.object().keys({ objectives: Joi.array().items(activityType) }),
    meta
  })).min(1)
});

module.exports = function (schemas) {
  return validate(schemas, Joi.array().items(repository).min(1));
};
