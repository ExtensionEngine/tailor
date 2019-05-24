'use strict';

const { createError, validationError } = require('../shared/error/helpers');
const { NOT_FOUND } = require('http-status-codes');
const { User } = require('../shared/database');
const Audience = require('../shared/auth/audience');

function index(req, res) {
  const attributes = ['id', 'email', 'role'];
  return User.findAll({ attributes })
    .then(users => res.json({ data: users }));
}

function forgotPassword({ body }, res) {
  const { email } = body;
  return User.findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, params }, res) {
  const { password, token } = body;
  return User.findOne({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save().catch(validationError);
    })
    .then(() => res.end());
}

function login({ user }, res) {
  const token = user.createToken({
    audience: Audience.Scope.Access,
    expiresIn: '5 days'
  });
  res.json({ data: { token, user: user.profile } });
}

module.exports = {
  index,
  forgotPassword,
  resetPassword,
  login
};
