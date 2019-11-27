'use strict';

const { ACCEPTED, BAD_REQUEST, CONFLICT, NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const { createError, validationError } = require('../shared/error/helpers');
const Audience = require('../shared/auth/audience');
const map = require('lodash/map');
const { Op } = require('sequelize');
const { User } = require('../shared/database');

const createFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { email, role, filter, archived }, options }, res) {
  const where = {};
  if (filter) where[Op.or] = createFilter(filter);
  if (email) where[Op.and].push({ email });
  if (role) where[Op.and].push({ role });
  return User.findAndCountAll({ where, ...options, paranoid: !archived })
    .then(({ rows, count }) => {
      return res.json({ data: { items: map(rows, 'profile'), total: count } });
    });
}

function upsert({ body: { email, firstName, lastName, role } }, res) {
  return User.inviteOrUpdate({ email, firstName, lastName, role })
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

function updateProfile({ user, body }, res) {
  const { email, firstName, lastName, imgUrl } = body;
  return user.update({ email, firstName, lastName, imgUrl })
    .then(({ profile }) => res.json({ user: profile }))
    .catch(() => validationError(CONFLICT));
}

function changePassword({ user, body }, res) {
  const { currentPassword, newPassword } = body;
  if (currentPassword === newPassword) return res.sendStatus(BAD_REQUEST);
  return user.authenticate(currentPassword)
    .then(user => user || createError(BAD_REQUEST))
    .then(user => user.update({ password: newPassword }))
    .then(() => res.sendStatus(NO_CONTENT));
}

function reinvite({ params }, res) {
  return User.findByPk(params.id)
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => User.sendInvitation(user))
    .then(() => res.status(ACCEPTED).end());
}

module.exports = {
  list,
  upsert,
  remove,
  forgotPassword,
  resetPassword,
  login,
  updateProfile,
  changePassword,
  reinvite
};
