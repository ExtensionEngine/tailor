# Tailor

[![GitHub package version](https://img.shields.io/github/package-json/v/ExtensionEngine/tailor.svg)](https://github.com/ExtensionEngine/tailor/blob/develop/package.json#L3)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d6d198f9c56b4ca799b4624c5bb3e16c?branch=develop)](https://www.codacy.com/app/underscope/tailor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ExtensionEngine/tailor&amp;utm_campaign=Badge_Grade)
[![codebeat badge](https://codebeat.co/badges/f577cd02-ad4f-464d-8afc-be153929703d)](https://codebeat.co/projects/github-com-extensionengine-tailor-develop)
[![Known Vulnerabilities](https://snyk.io/test/github/ExtensionEngine/tailor/badge.svg)](https://snyk.io/test/github/ExtensionEngine/tailor)
[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)
[![GitHub license](https://img.shields.io/github/license/ExtensionEngine/tailor.svg)](https://github.com/ExtensionEngine/tailor/blob/develop/LICENSE)
[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=102)](https://github.com/ellerbrock/open-source-badge/)

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
* App branding is configured via values set in a file named `.brand-rc.json`.
Use the `.brand-rc.json.example` file as a template: `cp .brand-rc.json.example .brand-rc.json` and enter configuration details.

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
* **hasPrerequisites** `Boolean` - Defines if this activity should offer other activities as prerequisites.
* **meta** `Array<Metadata>` - An array of objects defining activity metadata.

#### Metadata
Defines the structure of an activity metadata field.
* **key** `String`- Unique key for the field.
* **type** `String`- Type of the input component used on the client.
* **label** `String`- Display label.
* **placeholder** `String`- Input component placeholder.
* **validate** `MetadataValidator`- Validator object.
* **defaultValue** `*`- Default field value.

#### MetadataValidator
Defines validation rules on an activity metadata field.
* **rules** `Object`- Contains the following properties:
  * max `Number` - Maximum character count.
  * required `Boolean` - Defines if the field is required.

### `CONTENT_CONTAINERS`
An array of ContentContainer objects.

#### ContentContainer
Configuration for content containers. Contains the following properties:
* **type** `String` - Const for marking container type.
* **label** `String` - Content container label.
* **multiple** `Boolean` - Defines if there can be multiple instances of the ContentContainer inside one activity. False by default.
* **types** `Array<String>` - An array of possible teaching element types that can exist inside ContentContainer. If not specified all types of elements are allowed.
* **displayHeading** `Boolean` - Defines if a heading is displayed on top of the ContentContainer. False by default.
* **layout** `Boolean` - Defines if elements inside container can be placed two in a row. True by default.

### `PREVIEW_URL`
A string template that will be interpolated on the client using two route params, `repositoryId` and `activityId`, into a preview URL for each activiy. Example:
`https://my.url.com/#/repository/{repositoryId}/activity/{activityId}/preview`
