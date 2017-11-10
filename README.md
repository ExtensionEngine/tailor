# Tailor

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
* You can init the db (for development) by running `npm run db:seed`
* You can create admin user by running `npm run add:admin <email> <password>`
* App branding is configured via values set in a file named `.brand-rc.json`.
Use the `.brand-rc.json.example` file as a template: `cp .brand-rc.json.example .brand-rc.json` and enter configuration details.

## :books: Activities' structure
Activities' stucture can be altered through `.activities-rc.json` file. Use the `.activities-rc.json.example` file as a template: `cp .activities-rc.json.example .activities-rc.json` and enter configuration details.
Activities' structure is defined by the following properties:

### `ASSET_GROUP`
???

### `PREVIEW_URL`
A string template that will be interpolated on the client using two route params, `courseId` and `activityId`, into a preview URL for each activiy. Example:
`https://my.url.com/#/course/{courseId}/activity/{activityId}/preview`

### `SCHEMAS`
An array of Schema objects.

#### Schema
* **id** `String` - Schema identifier.
* **name** `String` - Schema display name.
* **structure** `Array<Outline>` - An array of objects containing schema outlines.

#### Outline
Defines activities' structure format. Contains the following properties:
* **level** `Number` - The hierarchy level for that particular activity type.
* **type** `String` - Name for this activity type.
* **subLevels** `Array<String>` - An array of strings that correspond to another activity's type.
* **label** `String` - Display label.
* **color** `String` - Display color in hexadecimal notation.
* **isEditable** `Boolean` - Activity allows adding activities/teaching elements to it.
* **hasIntroduction** `Boolean` - Activity allows adding introduction activity to it.
* **hasPerspectives** `Boolean` - Activity allows adding perspective activities to it.
* **hasAssessments** `Boolean` - Activity allows adding assessments activities to it.
* **hasExams** `Boolean` - Activity allows adding exam activities to it.
* **hasPrerequisites** `Boolean` - Defines if this activity should offer other activities as prerequisites.
* **meta** `Array<ActivityMetadata>` - An array of objects containing activities' metadata.

#### ActivityMetadata
Defines the structure of an activity metadata field.
* **key** `String`- Unique key for the field.
* **type** `String`- Type of the input component used on the client.
* **label** `String`- Display label.
* **placeholder** `String`- Input component placeholder.
* **validate** `MetadataValidator`- Validator object.

#### MetadataValidator
Defines validation rules on an activity metadata field.
* **rules** `Object`- Contains the following properties:
  * max `Number` - Maximum character count.
  * required `Boolean` - Defines if the field is required.

## :rocket: Launch

### Development
* Server: `npm run dev:server`
* Client (webpack dev server): `npm run dev:client`

### Production
* Bundle client by issuing `npm run build`
* `npm run start`
