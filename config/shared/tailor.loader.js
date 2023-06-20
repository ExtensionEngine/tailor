import { getSchemaApi, getWorkflowApi, processSchemas } from '@tailor-cms/config';
import config from '../../tailor.config.js';

const { SCHEMAS, WORKFLOWS } = config;

processSchemas(SCHEMAS);

const schema = getSchemaApi(SCHEMAS);
const workflow = getWorkflowApi(WORKFLOWS, schema);

export {
  SCHEMAS,
  WORKFLOWS,
  schema,
  workflow
};
