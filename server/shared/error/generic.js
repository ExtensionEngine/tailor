const config = require('../../../config/server');

function canProcessError() {
  return true;
}

function processError(err) {
  if (config.error.showDetails) {
    return {
      status: 500,
      error: {
        name: err.name || 'Internal server error',
        message: err.message || undefined,
        meta: {
          stack: err.stack ? err.stack.split('\n') : undefined
        }
      }
    };
  }

  return { status: 500 };
}

module.exports = {
  canProcessError,
  processError
};
