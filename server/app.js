'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const origin = require('./shared/origin');
const passport = require('passport');
const path = require('path');
require('express-async-errors');

require('./shared/auth');
const config = require('../config/server');
const logger = require('./shared/logger');
const router = require('./router');

const { STORAGE_PATH } = process.env;

const app = express();
app.use(helmet());
app.use(cors({ origin: config.auth.corsAllowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(origin());
app.use(express.static(path.join(__dirname, '../dist/')));
if (STORAGE_PATH) app.use(express.static(STORAGE_PATH));

// Mount main router.
app.use('/api/v1', requestLogger, router);

// Global error handler.
app.use(errorHandler);

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

module.exports = app;

function requestLogger(req, res, next) {
  logger.info({ req });
  next();
}

function errorHandler(err, req, res, next) {
  if (!err.status || err.status === 500) {
    res.status(500).end();
    logger.error({ err });
    return;
  }
  const { status, message } = err;
  res.status(err.status).json({ error: { status, message } });
}
