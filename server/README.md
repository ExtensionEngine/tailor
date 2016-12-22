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

### Configuration
Server is configured via environment variables contained in a file named `.env`.
Use the `.env.example` file as a template - it contains explanations and reasonable
defaults.

### Database setup
#### Initialization
Before launching the server for the first time:
* make sure ArangoDB deamon is running (default on OSX: `/usr/local/opt/arangodb/sbin/arangod`)
* run `npm run db:init <admin-email> <admin-password>`
This will make sure that:
1. the database with correct name exists,
2. all required collections exist,
3. one user with administrator privileges exists.
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
* clone the swagger-ui repo: `git clone https://github.com/swagger-api/swagger-ui.git`
* open `swagger-ui/dist/index.html` in your browser
* launch the Tailor server
* point swagger-ui to `http://localhost:3000/api/v1/swagger.json` and click 'Explore'

#### JSDoc
* generate the docs with `npm run doc:server`
* open `server/_doc_/index.html`
