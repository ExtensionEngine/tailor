'use strict';

const find = require('lodash/find');
const validateWorkflow = require('./workflow-validation');
const { WORKFLOWS } = require('./activities-rc.load')();

const priorities = [
  { id: 'CRITICAL', label: 'Critical', icon: 'priorityCritical' },
  { id: 'HIGH', label: 'High', icon: 'priorityHigh' },
  { id: 'MEDIUM', label: 'Medium', icon: 'priorityMedium' },
  { id: 'LOW', label: 'Low', icon: 'priorityLow' },
  { id: 'TRIVIAL', label: 'Trivial', icon: 'priorityTrivial' }
];

function getWorkflow(id) {
  return find(WORKFLOWS, { id });
}

validateWorkflow(WORKFLOWS);

module.exports = { priorities, getWorkflow };
