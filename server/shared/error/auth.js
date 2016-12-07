function canProcessError(err) {
  return err.isAuthError;
}

function processError(err) {
  return {
    status: 401,
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
