'use strict';

const yup = require('yup');

const workflowStatus = yup.object().shape({
  id: yup.string().required(),
  label: yup.string().required(),
  color: yup.string().required(),
  default: yup.boolean()
});

const duration = yup.object().shape({
  months: yup.number(),
  weeks: yup.number(),
  days: yup.number().when(['months', 'weeks'], {
    is: (months, weeks) => months || weeks,
    then: yup.number(),
    otherwise: yup.number().required()
  })
});

const workflow = yup.object().shape({
  id: yup.string().required(),
  statuses: yup.array().of(workflowStatus).min(1),
  dueDateWarningThreshold: duration
});

const workflows = yup.array().of(workflow);

module.exports = function (config) {
  try {
    workflows.validateSync(config);
  } catch (err) {
    console.error('Invalid workflow config!', err.message);
    throw err;
  }
};
