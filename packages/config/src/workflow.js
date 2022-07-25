'use strict';

const find = require('lodash/find');
const validateWorkflow = require('./workflow-validation');
const { WORKFLOWS } = require('./activities-rc.load')();

const priorities = [
  { id: 'CRITICAL', label: 'Critical', icon: 'priorityCritical' },
  { id: 'HIGH', label: 'High', icon: 'priorityHigh' },
  { id: 'MEDIUM', label: 'Medium', icon: 'priorityMedium', default: true },
  { id: 'LOW', label: 'Low', icon: 'priorityLow' },
  { id: 'TRIVIAL', label: 'Trivial', icon: 'priorityTrivial' }
];

module.exports = schema => {
  validateWorkflow(WORKFLOWS);

  return {
    priorities,
    getWorkflow,
    getPriority,
    getDefaultWorkflowStatus,
    getDefaultActivityStatus
  };

  function getWorkflow(id) {
    return find(WORKFLOWS, { id });
  }

  function getPriority(id) {
    return find(priorities, { id });
  }

  function getDefaultWorkflowStatus(id) {
    const { statuses } = getWorkflow(id);
    const { id: status } = statuses.find(it => it.default) || statuses[0];
    const { id: priority } = priorities.find(it => it.default);
    return { status, priority };
  }

  function getDefaultActivityStatus(type) {
    const schemaId = schema.getSchemaId(type);
    if (!schemaId) return;
    const { workflowId } = schema.getSchema(schemaId);
    if (!workflowId) return;
    return getDefaultWorkflowStatus(workflowId);
  }
};
