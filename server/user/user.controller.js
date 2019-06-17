'use strict';

const { NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const Audience = require('../shared/auth/audience');
const { createError } = require('../shared/error/helpers');
const { User } = require('../shared/database');

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

function resetPassword({ body, user }, res) {
  const { password } = body;
  return user.update({ password })
    .then(() => res.sendStatus(NO_CONTENT));
}

function login({ user }, res) {
  const token = user.createToken({
    audience: Audience.Scope.Access,
    expiresIn: '5 days'
  });
  return res.json({ data: { token, user: user.profile } });
}

module.exports = {
  index,
  forgotPassword,
  resetPassword,
  login
};
