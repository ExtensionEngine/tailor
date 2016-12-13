'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const swaggerJsDoc = require('swagger-jsdoc');

// Setup authentication before instantiating the main app router.
// eslint-disable-next-line no-unused-vars
const auth = require('./shared/auth');
const logger = require('./shared/logger');
const config = require('../config/server');
const router = require('./router');
const errorHandler = require('./shared/error').errorHandler;

const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());

// Initialize Passport and restore authentication state, if any, from the
// session.
const session = expressSession({
  secret: config.auth.sessionSecret,
  resave: false,
  saveUninitialized: false
});
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

// Log all incoming requests.
app.use('/api/v1', (req, res, next) => {
  logger.info({ req });
  next();
});

// Mount the main router.
app.use('/api/v1', router);

// Global error handler.
app.use(errorHandler());

// Serve swagger API spec in development environment.
if (config.swagger.serveDocs) {
  const spec = swaggerJsDoc({
    swaggerDefinition: config.swagger.swaggerDefinition,
    apis: ['./server/**/*.js']
  });

  app.get('/api/v1/swagger.json', (req, res, next) => res.status(200).json(spec));
}

// Handle non-existing routes.
app.use((req, res, next) => {
  res.status(404).json();
});

module.exports = app;
