'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const router = require('./router');
const logger = require('./logger');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Log all incoming requests.
app.use('/v1', (req, res, next) => {
  logger.info({ req });
  next();
});

// Mount the main router.
app.use('/v1', router);

// Handle non-existing routes.
app.use((req, res, next) => {
  res.status(404).json();
});

// Global error handler.
app.use((err, req, res, next) => {
  logger.error({ err });

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

module.exports = app;
