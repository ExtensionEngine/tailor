'use strict';

const Bunyan = require('bunyan');
const pkg = require('../../package.json');
const safeRequire = require('safe-require');

const isProduction = process.env.NODE_ENV === 'production';
const supportsEmoji = process.platform !== 'win32' &&
  process.env.TERM === 'xterm-256color';

const Level = getLevels(Bunyan);
const loggers = {};

class Logger extends Bunyan {
  addStream(stream, defaultLevel) {
    if (!isProduction) {
      stream = getOutputStream(stream);
    }
    return super.addStream(stream, defaultLevel);
  }

  _emit(record, noemit) {
    return super._emit(record, !createLogger.enabled || noemit);
  }
}

function createLogger(name, options = {}) {
  name = [pkg.name, name].filter(Boolean).join(':');
  const serializers = { ...Bunyan.stdSerializers, ...options.serializers };
  if (!loggers[name]) {
    options.level = process.env.LOG_LEVEL || options.level;
    loggers[name] = new Logger({ ...options, name, serializers });
  }
  return loggers[name];
}
Object.assign(createLogger, Logger, { enabled: true, createLogger, Level });

module.exports = createLogger;

function getLevels(Logger) {
  const { levelFromName: levels } = Logger;
  return Object.keys(levels).reduce((acc, name) => {
    return Object.assign(acc, { [name.toUpperCase()]: levels[name] });
  }, {});
}

function getOutputStream(loggerStream) {
  if (loggerStream.stream !== process.stdout || supportsEmoji) {
    return loggerStream;
  }
  const stripEmoji = safeRequire('emoji-strip');
  const split = safeRequire('split2');
  if (!stripEmoji || !split) return loggerStream;
  loggerStream.stream = split(line => stripEmoji(line) + '\n');
  loggerStream.stream.pipe(process.stdout);
  return loggerStream;
}
