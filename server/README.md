## Tailor server
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

### Run
* make sure ArangoDB deamon is running (default on OSX: `/usr/local/opt/arangodb/sbin/arangod`)
* run `npm run dev:server` in the repo directory

Optionally, you can pipe server output to bunyan for nicer logs:
```
npm run dev:server | ./node_modules/.bin/bunyan
```

### API Documentation
GETting `/api/v1/swagger.json` will return a JSON object documenting the API in
Swagger syntax.

To view the human-friendly version:
* clone the swagger-ui repo: `git clone https://github.com/swagger-api/swagger-ui.git`
* open `swagger-ui/dist/index.html` in your browser
* launch the Tailor server
* point swagger-ui to `http://localhost:3000/api/v1/swagger.json` and click 'Explore'
