import httpError from 'http-errors';

function validationError(err) {
  const code = 400;
  return Promise.reject(httpError(code, err.message, { validation: true }));
}

function createError(code = 400, message = 'An error has occured') {
  return Promise.reject(httpError(code, message, { custom: true }));
}

export default {
  createError,
  validationError
};
