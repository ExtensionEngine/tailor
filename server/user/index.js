const ctrl = require('./user.controller');
const model = require('./user.model');
const router = require('express-promise-router')();

router
  .post('/users/login', normalize, ctrl.login)
  .get('/users', ctrl.index)
  .post('/users/forgotPassword', normalize, ctrl.forgotPassword)
  .post('/users/resetPassword', normalize, ctrl.resetPassword);

module.exports = {
  model,
  router
};

function normalize(req, res, next) {
  const { body } = req;
  if (body && body.email) body.email = body.email.toLowerCase();
  next();
}
