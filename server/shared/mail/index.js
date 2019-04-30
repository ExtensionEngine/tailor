'use strict';

const { renderHtml, renderText } = require('./render');
const { origin } = require('../../../config/server');
const email = require('emailjs');
const logger = require('../logger');
const path = require('path');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const server = email.server.connect({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || null,
  ssl: Boolean(process.env.EMAIL_SSL),
  tls: Boolean(process.env.EMAIL_TLS)
});
logger.debug(getConfig(server), '📧  SMTP client created');

function send(message) {
  return new Promise((resolve, reject) => {
    server.send(message, (err, msg) => err ? reject(err) : resolve(msg));
  });
}

const templatesDir = path.join(__dirname, './templates/');
const resetUrl = user => `${origin}/#/reset-password/${user.token}`;

function invite(user) {
  const href = resetUrl(user);
  const { hostname } = new URL(href);
  const recipient = user.email;
  const data = { href, origin, hostname, recipient };
  const html = renderHtml(path.join(templatesDir, 'welcome.mjml'), data);
  const text = renderText(path.join(templatesDir, 'welcome.txt'), data);
  logger.debug({ recipient, sender: EMAIL_ADDRESS }, '📧  Sending invite email to:', recipient);
  return send({
    from: EMAIL_ADDRESS,
    to: recipient,
    subject: 'Invite',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function resetPassword(user) {
  const href = resetUrl(user);
  const recipient = user.email;
  const data = { href, recipient };
  const html = renderHtml(path.join(templatesDir, 'reset.mjml'), data);
  const text = renderText(path.join(templatesDir, 'reset.txt'), data);
  logger.debug({ recipient, sender: EMAIL_ADDRESS }, '📧  Sending reset password email to:', recipient);
  return send({
    from: EMAIL_ADDRESS,
    to: recipient,
    subject: 'Reset password',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function getConfig(server) {
  // NOTE: List public keys: https://git.io/fxV4j
  return pick(server.smtp, [
    'host', 'port', 'domain',
    'authentication', 'ssl', 'tls',
    'timeout'
  ]);
}

function commentsList({ email, comments, since }) {
  const recipient = email;
  const data = { comments, recipient, since };
  const html = renderHtml(path.join(templatesDir, 'comments.mjml'), data);
  const text = renderText(path.join(templatesDir, 'comments.txt'), data);
  logger.debug({ recipient, sender: EMAIL_ADDRESS }, '📧  Sending comments email to:', recipient);
  return send({
    from: EMAIL_ADDRESS,
    to: recipient,
    subject: 'Comments list',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

module.exports = {
  send,
  invite,
  resetPassword,
  commentsList
};
