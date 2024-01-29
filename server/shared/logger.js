import Bunyan from 'bunyan';
import { createRequire } from 'node:module';
import safeRequire from 'safe-require';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');

const isProduction = process.env.NODE_ENV === 'production';
const isWin32 = process.platform === 'win32';
const supportsEmoji = !isWin32 && (process.env.TERM === 'xterm-256color');

const Level = uppercaseLevelNames(Bunyan.levelFromName);
const loggers = {};

function requestSerializer(req) {
  if (!req || !req.connection) return req;
  // Make sure to remove sensitive information from the request object
  // eslint-disable-next-line
  const { access_token, cookie, ...loggedHeaders } = req.headers;
  return {
    method: req.method,
    // Accept `req.originalUrl` for expressjs usage.
    // https://expressjs.com/en/api.html#req.originalUrl
    url: req.originalUrl || req.url,
    headers: { ...loggedHeaders },
    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort
  };
}

class Logger extends Bunyan {
  addStream(stream, defaultLevel) {
    if (!isProduction) stream = processOutputStream(stream);
    return super.addStream(stream, defaultLevel);
  }

  _emit(record, noemit) {
    return super._emit(record, !createLogger.enabled || noemit);
  }
}

function createLogger(name, options = {}) {
  name = [pkg.name, name].filter(Boolean).join(':');
  const serializers = {
    ...Bunyan.stdSerializers,
    req: requestSerializer,
    ...options.serializers
  };
  if (!loggers[name]) {
    options.level = process.env.LOG_LEVEL || options.level;
    loggers[name] = new Logger({ ...options, name, serializers });
  }
  return loggers[name];
}

Object.assign(createLogger, Logger, { Level, createLogger, enabled: true });

export {
  createLogger,
  Level
};

export default createLogger;

function uppercaseLevelNames(levels) {
  const keys = Object.keys(levels);
  return keys.reduce((acc, it) => ({ ...acc, [it.toUpperCase()]: levels[it] }), {});
}

function processOutputStream(loggerStream) {
  if ((loggerStream.stream !== process.stdout) || supportsEmoji) return loggerStream;
  const stripEmoji = safeRequire('emoji-strip');
  const split = safeRequire('split2');
  if (!stripEmoji || !split) return loggerStream;
  loggerStream.stream = split(line => stripEmoji(line) + '\n');
  loggerStream.stream.pipe(process.stdout);
  return loggerStream;
}
