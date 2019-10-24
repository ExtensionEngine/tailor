'use strict';

const { ACCEPTED, NO_CONTENT, NOT_FOUND } = require('http-status-codes');
const Audience = require('../shared/auth/audience');
const { createError } = require('../shared/error/helpers');
const map = require('lodash/map');
const { Op } = require('sequelize');
const { role: { user: userRole } } = require('../../config/shared');
const { User } = require('../shared/database');

// TODO: Add fistName, lastName after profile merge
const createFilter = q => map(['email'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { email, role, filter, archived }, options }, res) {
  const where = { [Op.and]: [{ role: { [Op.ne]: userRole.INTEGRATION } }] };
  if (filter) where[Op.or] = createFilter(filter);
  if (email) where[Op.and].push({ email });
  if (role) where[Op.and].push({ role });
  return User.findAndCountAll({ where, ...options, paranoid: !archived })
    .then(({ rows, count }) => {
      return res.json({ data: { items: map(rows, 'profile'), total: count } });
    });
}

function upsert({ body: { email, role } }, res) {
  return User.inviteOrUpdate({ email, role })
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
  reinvite
};
