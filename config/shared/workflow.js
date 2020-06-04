'use strict';

const find = require('lodash/find');
const validateWorkflow = require('./workflow-validation');
const { WORKFLOWS } = require('./activities-rc.load')();

const priorities = [
  { id: 'TRIVIAL', label: 'Trivial', icon: 'priorityTrivial' },
  { id: 'LOW', label: 'Low', icon: 'priorityLow' },
  { id: 'MEDIUM', label: 'Medium', icon: 'priorityMedium' },
  { id: 'HIGH', label: 'High', icon: 'priorityHigh' },
  { id: 'CRITICAL', label: 'Critical', icon: 'priorityCritical' }
];

const priorityOptions = priorities.map(it => ({ value: it.id, label: it.label }));

const meta = {
  ASSIGNEE: {
    key: 'assigneeId',
    type: 'SELECT',
    label: 'Assignee',
    options: [],
    placeholder: 'Click to assign...',
    validate: { required: false }
  },
  STATUS: {
    key: 'statusId',
    type: 'SELECT',
    label: 'Status',
    options: [],
    placeholder: 'Click to set status...',
    validate: { required: false }
  },
  PRIORITY: {
    key: 'priorityId',
    type: 'SELECT',
    label: 'Priority',
    options: priorityOptions,
    placeholder: 'Click to set priority...',
    validate: { required: false },
    defaultValue: priorityOptions[2]
  },
  DUE_DATE: {
    key: 'dueDate',
    type: 'DATE',
    label: 'Due date',
    placeholder: 'Click to set due date...',
    validate: { required: false }
  }
};

function getWorkflow(id) {
  return find(WORKFLOWS, { id });
}

validateWorkflow(WORKFLOWS);

module.exports = { meta, priorities, getWorkflow, WORKFLOWS };
