function canProcessError(err) {
  return err.name === 'SyntaxError' && err.message.includes('JSON');
}

function processError(err) {
  return {
    status: 400,
    error: {
      name: 'Invalid JSON',
      message: err.message
    }
  };
}

module.exports = {
  canProcessError,
  processError
};
