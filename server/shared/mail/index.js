'use strict';

const { renderHtml, renderText } = require('./render');
const { origin } = require('../../../config/server');
const mailConfig = require('../../../config/server/mail');
const email = require('emailjs');
const fecha = require('fecha');
const logger = require('../logger');
const path = require('path');
const pick = require('lodash/pick');
const wrap = require('word-wrap');

const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;
const server = email.server.connect(mailConfig);
logger.debug(getConfig(server), '📧  SMTP client created');

const templatesDir = path.join(__dirname, './templates/');
const resetUrl = user => `${origin}/#/reset-password/${user.token}`;

function send(message) {
  return new Promise((resolve, reject) => {
    server.send(message, (err, msg) => err ? reject(err) : resolve(msg));
  });
}

function invite(user) {
  const href = resetUrl(user);
  const { hostname } = new URL(href);
  const recipient = user.email;
  const data = { href, origin, hostname, recipient, wrap: () => wrapText };
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
  const data = { href, recipient, wrap: () => wrapText };
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
  const data = { comments, recipient, since, format: () => format, wrap: () => wrapText };
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

function format(date, render) {
  return fecha.format(new Date(render(date)), 'M/D/YY HH:mm');
}

function wrapText(content, render) {
  return wrap(render(content), { width: 50 });
}

module.exports = {
  invite,
  resetPassword,
  commentsList
};
