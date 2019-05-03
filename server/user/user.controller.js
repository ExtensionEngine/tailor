'use strict';

const { createError, validationError } = require('../shared/error/helpers');
const { NOT_FOUND, BAD_REQUEST, NO_CONTENT } = require('http-status-codes');
const { User } = require('../shared/database');
const { getFileUrl, saveFile } = require('../shared/storage');
const { AVATAR_ROOT } = require('../shared/storage/helpers');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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

function updateProfile({ user, body }, res) {
  const { email, firstName, lastName, key: imgUrl } = body.userData;
  return user.update({ email, firstName, lastName, imgUrl })
    .then(({ profile }) => res.json({ user: profile }));
}

function changePassword({ user, body }, res) {
  const { currentPassword, newPassword } = body;
  return user.authenticate(currentPassword)
    .then(user => user || createError(BAD_REQUEST))
    .then(user => user.update({ password: newPassword }))
    .then(() => res.sendStatus(NO_CONTENT));
}

async function upload({ file }, res) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const key = path.join(AVATAR_ROOT, `${hash}___${file.originalname}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return res.json({ key, url: `storage://${key}`, publicUrl });
}

function readFile(file) {
  if (file.buffer) return Promise.resolve(file.buffer);
  return fs.readFile(file.path);
}

function sha256(...args) {
  const hash = crypto.createHash('sha256');
  args.forEach(arg => hash.update(arg));
  return hash.digest('hex');
}

module.exports = {
  index,
  forgotPassword,
  resetPassword,
  login,
  updateProfile,
  changePassword,
  upload
};
