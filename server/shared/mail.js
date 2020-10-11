'use strict';

const { mail: config, origin } = require('../../config/server');
const { createLogger, Level } = require('../shared/logger');
const email = require('emailjs');
const pick = require('lodash/pick');
const { promisify } = require('util');
const { URL } = require('url');
const urlJoin = require('url-join');

const logger = createLogger('mailer', { level: Level.DEBUG });

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
// NOTE: Enable SMTP tracing if DEBUG is set.
server.smtp.debug(Number(Boolean(process.env.DEBUG)));
logger.info(getConfig(server), '📧  SMTP client created');

const resetUrl = token => urlJoin(origin, '/#/reset-password/', token);
const send = promisify(server.send.bind(server));

function invite(user, token) {
  const href = resetUrl(token);
  const recipient = user.email;
  const { hostname } = new URL(href);
  const message = `
    An account has been created for you on ${hostname}.
    Please click <a href="${href}">here</a> to complete your registration.`;

  logger.info({ recipient, sender: from }, '📧  Sending invite email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user, token) {
  const href = resetUrl(token);
  const recipient = user.email;
  const message = `
    You requested password reset.
    Please click <a href="${href}">here</a> to complete the reset process.`;

  logger.info({ recipient, sender: from }, '📧  Sending reset password email to:', recipient);
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

function getConfig(server) {
  // NOTE: List public keys:
  // https://github.com/eleith/emailjs/blob/7fddabe/smtp/smtp.js#L86
  return pick(server.smtp, [
    'host', 'port', 'domain',
    'authentication', 'ssl', 'tls',
    'timeout'
  ]);
}
