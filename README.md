# Tailor

[![CircleCI build status](https://badgen.net/circleci/github/ExtensionEngine/tailor/develop?icon)](https://circleci.com/gh/ExtensionEngine/tailor)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d6d198f9c56b4ca799b4624c5bb3e16c?branch=develop)](https://www.codacy.com/app/underscope/tailor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExtensionEngine/tailor&amp;utm_campaign=Badge_Grade)
[![Known Vulnerabilities](https://snyk.io/test/github/ExtensionEngine/tailor/develop/badge.svg)](https://snyk.io/test/github/ExtensionEngine/tailor)
[![GitHub package version](https://badgen.net/github/release/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/releases)
[![GitHub license](https://badgen.net/github/license/ExtensionEngine/tailor)](https://github.com/ExtensionEngine/tailor/blob/develop/LICENSE)
[![js @extensionengine style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)
[![style @extensionengine style](https://badgen.net/badge/stylelint/@extensionengine/black)](https://github.com/ExtensionEngine/stylelint-config)
[![Open Source Love](https://badgen.net/badge/Open%20Source/%E2%9D%A4/3eaf8e)](https://github.com/ellerbrock/open-source-badge/)

Adaptive course authoring platform.


## :blue_book: Dependencies
* Node.js (>= 8.8.0)
* npm (>= 5.4.2)
* PostgreSQL (>= 9.6)

## :coffee: Installation

### Prerequisites
* Node.js & npm: https://nodejs.org/en/download/
* PostgreSQL: https://www.postgresql.org/download/
* Clone this repo

### Setup
* Run `npm install` in the repo directory
* Create database in PostgreSQL
* App is configured via environment variables contained in a file named `.env`.
Use the `.env.example` file as a template: `cp .env.example .env` and enter
configuration details.
* You can init the db (for development) by setting `ENABLE_DEFAULT_SCHEMA=1`
and running `npm run db:seed`.
* You can create admin user by running `npm run add:admin <email> <password>`
* App branding is configured via values set in a file named `.brandrc` (or `.brandrc.js`).
Use the `.brandrc.example` file as a template: `cp .brandrc.example .brandrc` and enter configuration details.

## :rocket: Launch

### Development
* Server: `npm run dev:server`
* Client (webpack dev server): `npm run dev:client`

### Production
* Bundle client by issuing `npm run build`
* `npm run start`

## :books: Content repository structure
Repository stucture can be altered through `.activities-rc.json` file. Use the `.activities-rc.json.example` file as a template: `cp .activities-rc.json.example .activities-rc.json` and enter configuration details. It's also possible to use `.activities-rc.js`, by using `module.exports` to export the structure.
By default, the file is searched for in the root of the project. If a custom location or a custom name is needed, it can be provided through the `activitiesConfig` param to any of the build scripts (without the extension), for example:
`npm run dev:client -- --activitiesConfig=server/.custom-activities-rc`

Content repository structures are defined using following properties:

### `SCHEMAS`
An array of Schema objects.

#### Schema
* **id** `String` - Schema identifier.
* **name** `String` - Schema display name.
* **meta** `Array<Metadata>` - An array of objects defining repository metadata.
* **structure** `Array<ActivityConfig>` - An array of objects which define schema structure.
* **contentContainers** `Array<ContentContainer>` - Array of content container configs

#### ActivityConfig - Schema structure elements
Configuration for schema structure nodes (activities). Contains the following properties:
* **level** `Number` - The hierarchy level for that particular activity type.
* **type** `String` - Const for marking activity type.
* **subLevels** `Array<String>` - An array of sub-types.
* **label** `String` - Display label.
* **color** `String` - Display color in hexadecimal notation.
* **contentContainers** `Array<String>` - Array of content container types that define which content containers can be added.
* **hasAssessments** `Boolean` - Activity allows adding assessments activities to it.
* **hasExams** `Boolean` - Activity allows adding exam activities to it.
* **exams** `Object` - Configuration for activity exams.
* **relationships** `Array<Relationship>` - Defines what relationships this activity has to other activities.
* **meta** `Array<Metadata>` - An array of objects defining activity metadata.

#### Relationship
Defines the structure of an activity realtionship field.
* **type** `String` - Defines the name of the relationship. The relationship will be published under this value.
* **label** `String` - Display label.
* **placeholder** `String` - Display label for select picker.
* **multiple** `Boolean` - Defines if the relationship can have multiple associations chosen. True by default.
* **searchable** `Boolean` - Defines if the list of activities can be searched. True by default.
* **allowEmpty** `Boolean` - Defines if the member list can be empty. True by default.
* **allowCircularLinks** `Boolean` - Defines if member of a relationship instance can set the owner of that instance 
as a member of its own instance of that relationship. Example, activity X sets activity Y as its prerequisite. 
If `allowCircualLinks` is set to true then activity Y can set activity X as its prerequisite. False by default.
* **allowInsideLineage** `Boolean` - Defines if an ancestor or a descendant can be a member of the relationship.
False by default.

#### Metadata
Defines the structure of an activity metadata field.
* **key** `String` - Unique key for the field.
* **type** `String` - Type of the input component used on the client.
* **label** `String` - Display label.
* **placeholder** `String` - Input component placeholder.
* **validate** `MetadataValidator` - Validator object.
* **defaultValue** `*` - Default field value.

#### MetadataValidator
Defines validation rules on an activity metadata field.
* **rules** `Object` - Contains the following properties:
  * max `Number` - Maximum character count.
  * required `Boolean` - Defines if the field is required.

### `CONTENT_CONTAINERS`
An array of ContentContainer objects.

#### ContentContainer
Configuration for content containers. Contains the following properties:
* **type** `String` - `const-cased` string for marking `ContentContainer` type.
* **label** `String` - String used for referencing `ContentContainer` on the UI.
* **multiple** `Boolean` - Defines if there can be multiple instances of the `ContentContainer` inside a single `Activity`. False by default.
* **types** `Array<String>` - An array of possible content element types that can exist inside a `ContentContainer`. If not specified all types of elements are allowed.
* **displayHeading** `Boolean` - Defines if a heading is displayed on top of the `ContentContainer`. False by default.
* **layout** `Boolean` - Defines if elements inside a `ContentContainer` instance can be placed two in a row. True by default.
* **config** `Object` - Defines `ContentContainer` specific properties.
* **required** `Boolean` - Defines if an instance of the `ContentContainer` is created if non exist. True by default.
* **publishedAs** `String` - Defines the `ContentContainer` the name of the file under which the container will be published. Defaults to `container`.
The name of the structure component used is the `kebab-cased` version of the `type` property. (example: ABC_DEF -> abc-def)

### `PREVIEW_URL`
A string template that will be interpolated on the client using two route params, `repositoryId` and `activityId`, into a preview URL for each activiy. Example:
`https://my.url.com/#/repository/{repositoryId}/activity/{activityId}/preview`
