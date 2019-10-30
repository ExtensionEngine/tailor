'use strict';

const { mail: config, origin } = require('../../config/server');
const email = require('emailjs');
const { promisify } = require('util');
const { URL } = require('url');
const urlJoin = require('url-join');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);

const resetUrl = token => urlJoin(origin, '/#/reset-password/', token);
const send = promisify(server.send.bind(server));

function invite(user, token) {
  const href = resetUrl(token);
  const { hostname } = new URL(href);
  const message = `
    An account has been created for you on ${hostname}.
    Please click <a href="${href}">here</a> to complete your registration.`;

  return send({
    from,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user, token) {
  const href = resetUrl(token);
  const message = `
    You requested password reset.
    Please click <a href="${href}">here</a> to complete the reset process.`;

  return send({
    from,
    to: user.email,
    subject: 'Reset password',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

module.exports = {
  send,
  invite,
  resetPassword
};
