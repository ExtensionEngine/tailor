const logger = require('../logger');
const genericErrorProcessor = require('./generic');
const defaultProcessors = [
  require('./auth'),
  require('./validation'),
  require('./arango'),
  require('./bodyParser')
];

function errorHandler(processors = defaultProcessors) {
  processors.push(genericErrorProcessor);

  return (err, req, res, next) => {
    logger.error({ err });

    for (const p of processors) {
      if (p.canProcessError(err)) {
        const { status, error } = p.processError(err);
        return res.status(status).json(error);
      }
    }
  };
}

module.exports = {
  errorHandler
};
