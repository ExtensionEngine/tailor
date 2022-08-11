import { processSchemas, getSchemaApi, getWorkflowApi } from '@tailor-cms/config';
import { SCHEMAS, WORKFLOWS } from '../../.tailor.config.js';

processSchemas(SCHEMAS);

const schema = getSchemaApi(SCHEMAS);
const workflow = getWorkflowApi(WORKFLOWS, schema);

export {
  SCHEMAS,
  WORKFLOWS,
  schema,
  workflow
}
