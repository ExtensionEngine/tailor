<div align="center">
  <img width="100" src="../../client/assets/img/default-logo-full.svg">
</div>

# @tailor-cms/config

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
const { SCHEMAS, schema, workflow } = require('@tailor-cms/config');
```

## API

### SCHEMAS
> Default configuration merged with custom configuration.

```
SCHEMAS: ISchemaInterface[]
```

```
interface ISchemaInterface {
  id: string;
  name: string;
  meta: array;
  structure: array;
  contentContainers: array;
  elementMeta: array;
};
```

### schema
> The object containing schema helper methods.

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

### workflow
> The object containing workflow properties and methods.

Properties:
- priorities

Methods:
- getWorkflow
- getPriority
- getDefaultWorkflowStatus
- getDefaultActivityStatus
