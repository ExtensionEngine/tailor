'use strict';

const { createError, validationError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { User } = require('../shared/database');

function index(req, res) {
  const attributes = ['id', 'email', 'role'];
  return User
    .findAll({ attributes })
    .then(users => res.json({ data: users }));
}

function forgotPassword({ body }, res) {
  let { email } = body;
  email = email.toLowerCase();
  return User
    .find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
  const { password, token } = body;
  return User
    .find({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save().catch(validationError);
    })
    .then(() => res.end());
}

function login({ body }, res) {
  let { email, password } = body;
  if (!email || !password) {
    createError(400, 'Please enter email and password');
  }

  return User
    .find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password'))
    .then(user => {
      const token = user.createToken();
      res.json({ data: { token, user: user.profile } });
    });
}

function generateIntegrationToken(req, res) {
  return User.find({ where: { role: 'INTEGRATION' } })
    .then(user => user.createToken({}))
    .then(token => res.json({token}));
}


module.exports = {
  index,
  forgotPassword,
  resetPassword,
  login,
  generateIntegrationToken
};
