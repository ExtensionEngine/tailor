'use strict';

const { mail: config, origin } = require('../../../config/server');
const { createLogger, Level } = require('../../shared/logger');
const { renderHtml, renderText } = require('./render');
const email = require('emailjs');
const path = require('path');
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

const send = promisify(server.send.bind(server));
const templatesDir = path.join(__dirname, './templates/');

const resetUrl = token => urlJoin(origin, '/#/reset-password/', token);
const activityUrl = (repositoryId, activityId) =>
  urlJoin(origin, '/#/repository', `${repositoryId}?activityId=${activityId}`);

module.exports = {
  send,
  invite,
  resetPassword,
  sendCommentNotification
};

function invite(user, token) {
  const href = resetUrl(token);
  const { hostname } = new URL(href);
  const recipient = user.email;
  const recipientName = user.firstName || user.email;
  const data = { href, origin, hostname, recipientName };
  const html = renderHtml(path.join(templatesDir, 'welcome.mjml'), data);
  const text = renderText(path.join(templatesDir, 'welcome.txt'), data);
  logger.info({ recipient, sender: from }, '📧  Sending invite email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Invite',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function resetPassword(user, token) {
  const href = resetUrl(token);
  const recipient = user.email;
  const recipientName = user.firstName || user.email;
  const data = { href, recipientName, origin };
  const html = renderHtml(path.join(templatesDir, 'reset.mjml'), data);
  const text = renderText(path.join(templatesDir, 'reset.txt'), data);
  logger.info({ recipient, sender: from }, '📧  Sending reset password email to:', recipient);
  return send({
    from,
    to: recipient,
    subject: 'Reset password',
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function sendCommentNotification(users, comment) {
  const { repositoryId, activityId } = comment;
  const href = activityUrl(repositoryId, activityId);
  const recipients = users.concat(',');
  const data = {
    href,
    origin,
    getInitials: () => (text, render) => render(text).substr(0, 2).toUpperCase(),
    ...comment
  };
  const html = renderHtml(path.join(templatesDir, 'comment.mjml'), data);
  const text = renderText(path.join(templatesDir, 'comment.txt'), data);
  logger.info({ recipients, sender: from }, '📧  Sending notification email to:', recipients);
  const { author, repositoryName, topic } = comment;
  return send({
    from,
    to: recipients,
    subject: `${author.label} left a comment on ${repositoryName} - ${topic}`,
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function getConfig(server) {
  // NOTE: List public keys:
  // https://github.com/eleith/emailjs/blob/7fddabe/smtp/smtp.js#L86
  return pick(server.smtp, [
    'host', 'port', 'domain',
    'authentication', 'ssl', 'tls',
    'timeout'
  ]);
}
