import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'node:url';
import helmet from 'helmet';
import origin from './shared/origin.js';
import path from 'node:path';
import storage from './repository/storage.js';
import storageProxy from './repository/proxy.js';

/* eslint-disable */
import('express-async-errors');
import auth from './shared/auth/index.js';
import config from '../config/server/index.js';
import router from './router.js';
import getLogger from './shared/logger.js';
const logger = getLogger();
/* eslint-enable */

const { STORAGE_PATH } = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

config.auth.oidc.enabled && (() => {
  const consolidate = import('consolidate');
  const session = import('express-session');
  app.engine('mustache', consolidate.mustache);
  app.set('view engine', 'mustache');
  app.use(session(config.auth.session));
})();

app.use(helmet());
app.use(cors({ origin: config.auth.corsAllowedOrigins, credentials: true }));
app.use(cookieParser(config.auth.jwt.cookie.secret));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth.initialize());
app.use(origin());
app.use(express.static(path.join(__dirname, '../dist/')));
if (STORAGE_PATH) app.use(express.static(STORAGE_PATH));
if (storageProxy.isSelfHosted) {
  const { proxy: middleware } = import('./shared/storage/proxy/mw')(storage, storageProxy);
  app.use(storageProxy.path, middleware);
}

// Mount main router.
app.use('/api', requestLogger, router);

// Global error handler.
app.use(errorHandler);

// Handle non-existing routes.
app.use((req, res, next) => res.status(404).end());

export default app;

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
