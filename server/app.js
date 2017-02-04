'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const includes = require('lodash/includes');
const passport = require('passport');

// Setup authentication before instantiating the main app router.
// eslint-disable-next-line no-unused-vars
const auth = require('./shared/auth');
const config = require('../config/server');
const logger = require('./shared/logger');
const router = require('./router');

const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: config.auth.corsAllowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());

// Log all incoming requests.
app.use('/api/v1', (req, res, next) => {
  logger.info({ req });
  next();
});

// Apply auth for all routes except whitelisted.
app.use('*', (req, res, next) => {
  const whitelisted = [
    '/api/v1/users/login',
    '/api/v1/users/forgotPassword',
    '/api/v1/users/resetPassword'
  ];

  if (includes(whitelisted, req.baseUrl)) {
    next();
  } else {
    passport.authenticate('jwt')(req, res, next);
  }
});

// Mount main router.
app.use('/api/v1', router);

// Global error handler.
app.use((err, req, res, next) => {
  if (!err.status || err.status === 500) {
    res.status(500).end();
    logger.error({ err });
    return;
  }
  const { status, message } = err;
  res.status(err.status).json({ error: { status, message } });
});

// Serve swagger API spec in development environment.
if (config.swagger.serveDocs) {
  const path = require('path');
  const swaggerJsDoc = require('swagger-jsdoc');
  const spec = swaggerJsDoc({
    swaggerDefinition: config.swagger.swaggerDefinition,
    apis: ['./server/**/*.js']
  });

  app.get('/api/v1/swagger.json', (req, res, next) => res.json(spec));
  const dir = path.join(__dirname, '../node_modules/swagger-ui/dist');
  app.use('/swagger', express.static(dir));
}

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

module.exports = app;
