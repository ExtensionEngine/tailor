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

const app = express();
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
app.use((err, req, res, next) => {
  logger.error({ err });

  // TODO(matej): validation errors should be handled by validation middleware.
  if (err.isJoi) {
    return res.status(400).json({
      error: {
        name: err.name,
        message: err.message
      }
    });
  }

  if (err.isAuthError) {
    return res.status(401).json({
      error: {
        name: err.name,
        message: err.message
      }
    });
  }

  if (err.isArangoError) {
    // Treat '1202 - ERROR_ARANGO_DOCUMENT_NOT_FOUND' as '404 Not Found'.
    // https://docs.arangodb.com/3.0.10/Manual/Appendix/ErrorCodes.html
    if (err.errorNum === 1202) return res.status(404).json();

    // Don't leak error details in production.
    if (process.env.NODE_ENV === 'production') return res.status(500).json();

    // err.response is circular and cannot be serialized with res.json().
    delete err.response;
  }

  return res.status(500).json({
    error: {
      name: err.name,
      message: err.message,
      meta: err
    }
  });
});

// Serve swagger API spec in development environment.
if (process.env.NODE_ENV !== 'production') {
  const spec = swaggerJsDoc({
    swaggerDefinition: config.swagger,
    apis: ['./server/**/*.js']
  });

  app.get('/api/v1/swagger.json', (req, res, next) => res.status(200).json(spec));
}

// Handle non-existing routes.
app.use((req, res, next) => {
  res.status(404).json();
});

module.exports = app;
