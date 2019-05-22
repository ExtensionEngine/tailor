'use strict';

const { createError, validationError } = require('../shared/error/helpers');
const { NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const { role } = require('../../config/shared');
const { User } = require('../shared/database');

function index({ query: { roleType } }, res) {
  let options = { attributes: ['id', 'email', 'role'] };
  return User.scope({ method: ['withRoleType', roleType] })
    .findAll(options)
    .filter(user => user.role !== role.user.INTEGRATION)
    .then(data => res.json({ data }));
}

function upsert({ body: { email, role } }, res) {
  const data = { deletedAt: null, role, email };
  return User.findOne({ where: { email }, paranoid: false })
    .then(user => user ? user.update(data) : User.invite(data))
    .then(data => res.json({ data }));
}

function remove({ params: { id } }, res) {
  return User.destroy({ where: { id } }).then(() => res.sendStatus(NO_CONTENT));
}

function forgotPassword({ body }, res) {
  const { email } = body;
  return User.findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body }, res) {
  const { password, token } = body;
  return User.findOne({ where: { token } })
    .then(user => user || createError(NOT_FOUND, 'Invalid token'))
    .then(user => {
      user.password = password;
      return user.save().catch(validationError);
    })
    .then(() => res.end());
}

function login({ body }, res) {
  const { email, password } = body;
  if (!email || !password) {
    createError(400, 'Please enter email and password');
  }
  return User.findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User does not exist'))
    .then(user => user.authenticate(password))
    .then(user => user || createError(NOT_FOUND, 'Wrong password'))
    .then(user => {
      const token = user.createToken({ expiresIn: '5 days' });
      res.json({ data: { token, user: user.profile } });
    });
}

module.exports = {
  index,
  upsert,
  remove,
  forgotPassword,
  resetPassword,
  login
};
