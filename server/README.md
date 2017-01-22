## Tailor Server
### Dependencies
* Node.js (>= 6.0)
* npm (>= 3.0)
* ArangoDb (>= 3.1)

### Installation
* Node.js & npm: either download from [official site](https://nodejs.org/en/download/)
or install `nvm` first, then follow instructions listed on the
[install page](https://github.com/creationix/nvm/blob/master/README.markdown#installation)
* ArangoDB: https://www.arangodb.com/download/
* clone this repo and run `npm install` in the repo directory

Fresh installation of ArangoDB comes with one administrator user (username 'root',
blank password).

### Configuration
Server is configured via environment variables contained in a file named `.env`.
Use the `.env.example` file as a template:
```
cp .env.example .env
```
Values set in the example file are reasonable defaults for production - you will
probably flip all the boolean switches in development environment.

### Database setup
#### Initialization
Before launching the server for the first time:
* make sure ArangoDB deamon is running (default on OSX: `/usr/local/opt/arangodb/sbin/arangod`)
* run `npm run db:init <admin-email> <admin-password>`

This will make sure that:
* the database with correct name exists
* all required collections exist
* one user with administrator privileges exists

After the script finishes, you can log into the website with `<admin-email>`
and `<admin-password>` you picked.

#### Seeding
You can fill the database with mock data by running `npm run db:seed`.

### Launch
In repo directory, run:
```
npm run dev:server
```
This will start the auto-reloading server. Optionally, you can pipe server
output to bunyan for nicer logs (highly recommended):
```
npm run dev:server | ./node_modules/.bin/bunyan
```

### Documentation
#### API and Swagger
Once the dev server is running, GETting `/api/v1/swagger.json` will return a
JSON object documenting the API in Swagger syntax.

To view the human-friendly version:
* set `API_SERVE_SWAGGER_DOCS=1` in your local .env file
* launch the Tailor server
* open `localhost:3000/swagger` in your browser
* point swagger-ui to `http://localhost:3000/api/v1/swagger.json` and click
'Explore'

(In both cases port 3000 is used; the exact value depends on environment
variable `SERVER_PORT`.)

#### JSDoc
* generate the docs with `npm run doc:server`
* open `server/_doc_/index.html`
