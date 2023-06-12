'use strict';

const { getSchemaApi, getWorkflowApi, processSchemas } = require('@tailor-cms/config');
const { SCHEMAS, WORKFLOWS } = require('../../tailor.config.js');

processSchemas(SCHEMAS);

const schema = getSchemaApi(SCHEMAS);
const workflow = getWorkflowApi(WORKFLOWS, schema);

module.exports = {
  SCHEMAS,
  WORKFLOWS,
  schema,
  workflow
};
