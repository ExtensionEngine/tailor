const config = require('../../../config/server');

function canProcessError(err) {
  return err.isArangoError;
}

function processError(err) {
  let status;
  let error;

  // err.response is circular and cannot be serialized with res.json().
  delete err.response;

  // https://docs.arangodb.com/3.0.10/Manual/Appendix/ErrorCodes.html
  switch (err.errorNum) {
  // Treat '1202 - ERROR_ARANGO_DOCUMENT_NOT_FOUND' as '404 Not Found'.
    case 1202:
      status = 404;
      error = undefined;
      break;
    default:
      status = 500;
      error = config.error.showDetails
      ? {
        name: err.name,
        message: err.message,
        meta: err
      }
      : undefined;
  }

  return { error, status };
}

module.exports = {
  canProcessError,
  processError
};
