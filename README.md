<div align="center">
  <img width="180" src="./client/assets/img/default-logo-compact.svg">
</div>

# Tailor CMS

[![CircleCI build
status](https://badgen.net/circleci/github/ExtensionEngine/tailor/develop?style=svg)](https://circleci.com/gh/ExtensionEngine/tailor)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f3eab80316244b7b959b7bbf3d7c3ace)](https://www.codacy.com/gh/ExtensionEngine/tailor/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExtensionEngine/tailor&amp;utm_campaign=Badge_Grade)
[![Known
Vulnerabilities](https://badgen.net/snyk/ExtensionEngine/tailor/develop)](https://snyk.io/test/github/ExtensionEngine/tailor)
[![GitHub package
version](https://badgen.net/github/release/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/releases)
[![GitHub
license](https://badgen.net/github/license/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/blob/develop/LICENSE)
[![js @extensionengine
style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)
[![style @extensionengine
style](https://badgen.net/badge/stylelint/@extensionengine/black)](https://github.com/ExtensionEngine/stylelint-config)
[![Open Source
Love](https://badgen.net/badge/Open%20Source/%E2%9D%A4/3eaf8e)](https://github.com/ellerbrock/open-source-badge/)

Configurable headless CMS for complex content structures.

## Dependencies

- Node.js (>= 16.16.0)
- npm (>= 8.11.0)
- PostgreSQL (>= 9.4)

## Installation

### Prerequisites

- Node.js & npm: https://nodejs.org/en/download/
- PostgreSQL: https://www.postgresql.org/download/
- Clone this repo

### Setup

- Run `npm install` in the repo directory
- Create a database in PostgreSQL
- Application is configured via environment variables contained in a file named
  `.env`. Use the `.env.example` file as a template: `cp .env.example .env` and
  enter configuration details.
- Initialize database by running `npm run db migrate`
- To enable demo repository schema configuration copy `tailor.config.js.example`
  into `tailor.config.mjs.`. For more details about the custom schema configuration
  please refer [to this guide](https://extensionengine.github.io/tailor-docs/tailor/developer-guide/configuration.html).
- Configure asset storage proxy by following the steps [in this guide](https://extensionengine.github.io/tailor-docs/tailor/developer-guide/storage-proxy.html)
  based on your environment.
- You can create admin user by running `npm run add:admin <email> <password>`
- App branding is configured via values set in a file named `.brandrc.mjs`. 
  Use the `.brandrc.js.example` file as a template: `cp
  .brandrc.js.example .brandrc.mjs` and enter configuration details.

## Launch

### Development

- Server: `npm run dev:server`
- Client (webpack dev server): `npm run dev:client`

This project uses a monorepo setup. In order to contribute to [packages](./packages) following commands should be executed:
- Run `npm run packages:setup` - initial setup, dependency installation, package linking, etc. This command should be executed only a single time. 
- Run `npm run packages:build` - build all packages. Run this command after altering the package's code.
- Run `npm run packages:build --package=<package-name>` to build only specified package. For example: `npm run packages:build --package=core-components`.

### Production

- Bundle client by issuing `npm run build`
- `npm run start`

## Content repository structure

Repository structure can be altered using tailor configuration file, which must be placed inside the root
directory and named `tailor.config.mjs`.

Use the `tailor.config.js.example` file as a template:

```
$ cp tailor.config.js.example tailor.config.mjs
```

and enter the configuration details. At the current time, it is not possible to override the filename or
location of the configuration file.

Content repository structures are defined using the following properties:

### `SCHEMAS`

An array of Schema objects.

#### Schema

- **id** `String` - Schema identifier.
- **name** `String` - Schema display name.
- **workflowId** `String` - [Workflow](#workflow) identifier.
- **meta** `Array<Metadata>` - An array of objects defining repository metadata.
- **structure** `Array<ActivityConfig>` - An array of objects which define
  schema structure.
- **contentContainers** `Array<ContentContainer>` - Array of content container
  configs.
- **elementMeta** `Array<ElementMetaConfig>` - An array of objects defining
  content element metadata.

#### ActivityConfig - Schema structure elements

Configuration for schema structure nodes (activities). Contains the following
properties:

- **type** `String` - Const for marking activity type.
- **rootLevel** `Boolean` - Used to define first level (root) activity types
- **subLevels** `Array<String>` - An array of sub-types.
- **label** `String` - Display label.
- **color** `String` - Display color in hexadecimal notation.
- **isTrackedInWorkflow** `Boolean` - Defines whether the workflow status will be tracked for this activity type.
- **contentContainers** `Array<String>` - Array of content container types that
  define which content containers can be added.
- **hasExams** `Boolean` - Activity allows adding exam activities to it.
- **exams** `Object` - Configuration for activity exams.
- **relationships** `Array<ActivityRelationship>` - Defines what relationships this
  activity has to other activities.
- **meta** `Array<Metadata>` - An array of objects defining activity metadata.

#### ActivityRelationship

Defines the structure of the activity relationship field.

- **type** `String` - Defines the name of the relationship. The relationship
  will be published under this value.
- **label** `String` - Display label.
- **placeholder** `String` - Display label for the select picker.
- **multiple** `Boolean` - Defines if the relationship can have multiple
  associations chosen. True by default.
- **searchable** `Boolean` - Defines if the list of activities can be searched.
  True by default.
- **allowEmpty** `Boolean` - Defines if the member list can be empty. True by
  default.
- **allowCircularLinks** `Boolean` - Defines if a member of the relationship
  instance can set the owner of that instance as a member of its own instance of
  that relationship. Example, activity X sets activity Y as its prerequisite. If
  `allowCircualLinks` is set to true then activity Y can set activity X as its
  prerequisite. False by default.
- **allowInsideLineage** `Boolean` - Defines if an ancestor or a descendant can
  be a member of the relationship. False by default.
- **allowedTypes** `Array<String>` - Defines activity types that can be associated in a relationship.

#### Metadata

Defines the structure of the activity metadata field.

- **key** `String` - Unique key for the field.
- **type** `String` - Type of the input component used on the client.
- **label** `String` - Display label.
- **placeholder** `String` - Input component placeholder.
- **validate** `MetadataValidator` - Validator object.
- **defaultValue** `*` - Default field value.

#### MetadataValidator

Defines validation rules on an activity metadata field.

- **rules** `Object` - Contains the following properties:
- max `Number` - Maximum character count.
- required `Boolean` - Defines if the field is required.

### `CONTENT_CONTAINERS`

An array of ContentContainer objects.

#### ContentContainer

Configuration for content containers. Contains the following properties:

- **type** `String` - `const-cased` string for marking `ContentContainer` type.
- **templateId** `String` - `const-cased` string that defines which custom
  `ContentContainer` is used to display this container. Needs to match the
  `templateId` property of the desired custom `ContentContainer`. If not
  specified the default `ContentContainer` is used to display this container.
- **label** `String` - String used for referencing `ContentContainer` on the UI.
- **multiple** `Boolean` - Defines if there can be multiple instances of the
  `ContentContainer` inside a single `Activity`. False by default.
- **types** `Array<String>` - An array of possible content element types that
  can exist inside a `ContentContainer`. If not specified all types of elements
  are allowed.
- **displayHeading** `Boolean` - Defines if a heading is displayed on top of the
  `ContentContainer`. False by default.
- **layout** `Boolean` - Defines if elements inside a `ContentContainer`
  instance can be placed two in a row. True by default.
- **config** `Object` - Defines `ContentContainer` specific properties.
- **required** `Boolean` - Defines if an instance of the `ContentContainer` is
  created if non exist. True by default.
- **publishedAs** `String` - Defines the name of the file under which the
  container will be published. Defaults to `container`. The name of the
  structure component used is the `kebab-cased` version of the `type` property.
  (example: ABC_DEF -> abc-def)

#### ElementMetaConfig

Defines the structure of an content element metadata.

- **type** `String` - Type of content element (example: "IMAGE", "HTML").
- **inputs** `Array<ElementMeta>` - Defines what meta fields content element has.
- **relationships** `Array<ElementRelationship>` - Defines what relationship
  metadata content element has (relationships with content elements from the same 
  or other activities in the repository).

#### ElementRelationship

Defines the structure of an content element relationship field.

- **key** `String` - Defines the name of the relationship. The relationship
  will be published under this value.
- **label** `String` - Display label.
- **placeholder** `String` - Label for relationship add button and modal title.
- **multiple** `Boolean` - Defines if the relationship can have multiple
  associations chosen. True by default.
- **allowedTypes** `Array<String>` - Defines to what type of content elements
   given content element can have relationship with (example: `['VIDEO']`).

#### ElementMeta

Defines what meta fields content element has.

- **key** `String` - Unique key for the field.
- **type** `String` - Type of the input component used on the client.
- **label** `String` - Display label.
- **description** `String` - Description of meta field.
- **options** `Array<Object>` - Options for certain types of input component.
  For example, for select component, options would be:
  ```json
  "type": "SELECT"
  "options": [{
      "label": "First",
      "value": "first"
    }, {
      "label": "Second",
      "value": "second"
    }]
  ```

### `PREVIEW_URL`

A string template that will be interpolated on the client using two route
params, `repositoryId` and `activityId`, into a preview URL for each activity.
Example:
`https://my.url.com/#/repository/{repositoryId}/activity/{activityId}/preview`

## Workflows

For each schema, workflow can be defined to enable users to track and assign activities which are flagged for tracking. Each workflow is defined by a set of statuses that the activity can have.
Workflows are assigned to schemas through schema's `workflowId` option in [tailor configuration file](#content-repository-structure).

Workflows are configured with the following options in the [tailor configuration file](#content-repository-structure):

### `WORKFLOWS`

An array of Workflow objects.

#### Workflow

Defines activity statuses for repository workflow. Workflow can be reused across multiple [schemas](#schema) by assigning the same workflow ID to schema's `workflowId` option.

- **id** `String` - Workflow identifier.
- **statuses** `Array<ActivityStatus>` - An array of possible activity statuses.
- **dueDateWarningThreshold** `Object` - Defines threshold (in days, weeks or months) relative to activity's due date, after which the warning of upcoming due date is displayed.

#### ActivityStatus
- **id** `String` - Activity status identifier.
- **label** `String` - Display label.
- **color** `String` - Display color.
- **default** `Boolean` - Defines that the status is the default, which the activity has when it's created.

## EXTENSIONS

Tailor supports creation of custom content elements and custom containers. These extensions
can have unique content and structure that the default content elements and
containers do not support. The template for creating custom content elements
can be found [here](https://github.com/ExtensionEngine/tailor-element-template)
while the template for creating custom containers can be found
[here](https://github.com/ExtensionEngine/tailor-container-template).

### Installing extensions

1. copy (or git clone) extension files in `extensions/content-<elements or containers>/<my-extension-name>`
2. create index.js file in `extensions/content-<elements or containers>` directory
3. in the file from the previous step add
```javascript
module.exports = ['my-extension-name'];
```

Note that `module.exports` is an array and you can add as many extensions and just include their folder names in this array to include all of them.
After installation, the extension is ready for use and should be listed in `tailor.config.js` file.
