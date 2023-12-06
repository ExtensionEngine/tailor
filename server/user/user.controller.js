import { ACCEPTED, BAD_REQUEST, CONFLICT, FORBIDDEN, NO_CONTENT, NOT_FOUND } from 'http-status-codes';
import { createError, validationError } from '../shared/error/helpers.js';
import db from '../shared/database/index.js';
import map from 'lodash/map.js';
import { Op } from 'sequelize';
import { user as userRole } from '../../config/shared/role.js';

const { sequelize, Tag, User, UserTag } = db;
const createFilter = q => map(['email', 'firstName', 'lastName'],
  it => ({ [it]: { [Op.iLike]: `%${q}%` } }));

function list({ query: { email, role, filter, archived }, options }, res) {
  const where = { [Op.and]: [] };
  if (filter) where[Op.or] = createFilter(filter);
  if (email) where[Op.and].push({ email });
  if (role) where[Op.and].push({ role });
  return User.findAndCountAll({ where, ...options, paranoid: !archived })
    .then(({ rows, count }) => {
      return res.json({ data: { items: map(rows, 'profile'), total: count } });
    });
}

function upsert({ body: { uid, email, firstName, lastName, role } }, res) {
  return User.inviteOrUpdate({ uid, email, firstName, lastName, role })
    .then(data => res.json({ data }));
}

function remove({ params: { id } }, res) {
  return User.destroy({ where: { id } }).then(() => res.sendStatus(NO_CONTENT));
}

function forgotPassword({ body }, res) {
  const { email } = body;
  return User.unscoped().findOne({ where: { email } })
    .then(user => user || createError(NOT_FOUND, 'User not found'))
    .then(user => user.sendResetToken())
    .then(() => res.end());
}

function resetPassword({ body, user }, res) {
  const { password } = body;
  return user.update({ password })
    .then(() => res.sendStatus(NO_CONTENT));
}

function getProfile({ user, authData }, res) {
  return res.json({ user: user.profile, authData });
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
  return User.unscoped().findByPk(params.id)
    .then(user => user || createError(NOT_FOUND, 'User does not exist!'))
    .then(user => User.sendInvitation(user))
    .then(() => res.status(ACCEPTED).end());
}

function addTag(
  {
    user,
    body: { name, isAccessTag },
    params: { id: userId }
  },
  res
) {
  return sequelize.transaction(async transaction => {
    const tagUser = await User.findByPk(userId, { transaction });
    if (!tagUser) return createError(NOT_FOUND, 'User not found');
    const tag = await Tag.fetchOrCreate({ user, name, isAccessTag, transaction });
    await tagUser.addTags([tag], { transaction });
    return res.json({ data: tag });
  });
}

async function removeTag({ user, params: { tagId, id: userId } }, res) {
  const tagUser = await User.findByPk(userId);
  if (!tagUser) return createError(NOT_FOUND, 'User not found');
  const tag = await Tag.findByPk(tagId);
  if (!tag) return createError(NOT_FOUND, 'Tag not found');
  if (tag.isAccessTag && user.role !== userRole.INTEGRATION) {
    return res.status(FORBIDDEN, 'Only integration users can remove access tags');
  }
  const where = { tagId, userId };
  await UserTag.destroy({ where });
  return res.status(NO_CONTENT).send();
}

export default {
  list,
  upsert,
  remove,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword,
  reinvite,
  addTag,
  removeTag
};
