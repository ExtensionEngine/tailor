<div align="center">
  <img width="100" src="../../client/assets/img/default-logo-full.svg">
</div>

# @tailor-cms/config

[![Npm
version](https://badgen.net/npm/v/@tailor-cms/config)](https://www.npmjs.com/package/@tailor-cms/config)
[![GitHub
license](https://badgen.net/github/license/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/blob/develop/LICENSE)
[![js @extensionengine
style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)
[![style @extensionengine
style](https://badgen.net/badge/stylelint/@extensionengine/black)](https://github.com/ExtensionEngine/stylelint-config)
[![Open Source
Love](https://badgen.net/badge/Open%20Source/%E2%9D%A4/3eaf8e)](https://github.com/ellerbrock/open-source-badge/)

## Usage

```js
const { getSchemaApi, getWorkflowApi, processSchemas } = require('@tailor-cms/config');
```

## API

### getSchemaApi(SCHEMAS)
> The method returning an object containing schema helper methods.

Methods:
- getSchemaId
- getSchema
- getLevel
- getOutlineLevels
- isOutlineActivity
- getOutlineChildren
- filterOutlineActivities
- isTrackedInWorkflow
- getRepositoryMetadata
- getActivityLabel
- getActivityMetadata
- getElementMetadata
- getLevelRelationships
- getRepositoryRelationships
- getSiblingTypes
- getSupportedContainers
- getContainerTemplateId
- isEditable

### getWorkflowApi(WORKFLOWS, schemaApi)
> The method returning an object containing workflow properties and methods.

Properties:
- priorities

Methods:
- getWorkflow
- getPriority
- getDefaultWorkflowStatus
- getDefaultActivityStatus

### processSchemas(SCHEMAS)
> The method which validates schemas, prefixes activity types with schema ID, e.g. `SCHEMA_ID/TYPE`, 
and processes meta.
