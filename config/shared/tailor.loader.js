import { getSchemaApi, getWorkflowApi, processSchemas } from '@tailor-cms/config';
import { SCHEMAS, WORKFLOWS } from '../../tailor.config.mjs';

processSchemas(SCHEMAS);

const schema = getSchemaApi(SCHEMAS);
const workflow = getWorkflowApi(WORKFLOWS, schema);

export {
  SCHEMAS,
  WORKFLOWS,
  schema,
  workflow
};
