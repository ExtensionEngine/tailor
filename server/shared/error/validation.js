function canProcessError(err) {
  return err.isJoi || err.isValidationError;
}

function processError(err) {
  return {
    status: 400,
    error: {
      name: err.name,
      message: err.message
    }
  };
}

module.exports = {
  canProcessError,
  processError
};
