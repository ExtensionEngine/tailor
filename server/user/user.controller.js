'use strict';

const { createError, validationError } = require('../shared/error/helpers');
const { NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const { role } = require('../../config/shared');
const { User } = require('../shared/database');

function index({ query: { roleType } }, res) {
  let options = { attributes: ['id', 'email', 'role'], raw: true };
  if (roleType) options.where = { role: { $in: role.getRoleNames(roleType) } };
  return User.findAll(options).then(data => res.json({ data }));
}

function upsert({ body: { email, role } }, res) {
  return User.findOne({ where: { email }, paranoid: false })
    .then(user => user ? user.update({ role }) : User.invite({ email, role }))
    .then(user => user.deletedAt ? user.restore() : user)
    .then(data => res.json({ data }));
}

function remove({ params: { id } }, res) {
  return User.destroy({ where: { id } }).then(() => res.sendStatus(NO_CONTENT));
}

function forgotPassword({ body }, res) {
  const { email } = body;
  return User.find({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body }, res) {
  const { password, token } = body;
  return User.find({ where: { token } })
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
  return User.find({ where: { email } })
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
