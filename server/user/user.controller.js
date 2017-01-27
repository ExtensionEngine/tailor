'use strict';

const { NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const User = require('./user.model');
const { validationError } = require('../shared/error');

function index(req, res) {
  const attributes = ['id', 'email', 'role'];
  return User
    .findAll({ attributes })
    .then(users => res.json({ data: users }));
}

function requestPasswordReset({ body }, res) {
  let { email } = body;
  email = email.toLowerCase();
  return User
    .find({ where: { email } })
    .then(user => user || validationError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
  const { password, token } = body;
  return User
    .find({ where: { token } })
    .then(user => user || validationError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save().catch(validationError());
    })
    .then(() => res.end());
}

function login(req, res) {
  const user = req.user;
  res.json({ data: user });
}

function logout(req, res) {
  req.session.destroy();
  res.status(NO_CONTENT).end();
}

module.exports = {
  index,
  requestPasswordReset,
  resetPassword,
  login,
  logout
};
