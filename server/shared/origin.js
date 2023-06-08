import createLogger from './logger.js';
import { hostname } from '../../config/server/index.js';

const logger = createLogger();
const isProduction = process.env.NODE_ENV === 'production';

export default () => {
  if (hostname) return middleware;
  const message = 'Origin: "HOSTNAME" is not set, using "Host" HTTP header.';
  isProduction ? logger.warn('⚠️ ', message) : logger.info(message);
  return middleware;
};

function middleware(req, _, next) {
  Object.defineProperty(req, 'origin', {
    get: () => `${req.protocol}://${hostname || req.get('host')}`
  });
  next();
}
