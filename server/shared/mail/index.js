'use strict';

const { mail: config, origin } = require('../../../config/server');
const { renderHtml, renderText } = require('./render');
const email = require('emailjs');
const logger = require('../logger');
const path = require('path');
const pick = require('lodash/pick');
const { promisify } = require('util');
const { URL } = require('url');
const urlJoin = require('url-join');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
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
  sendCommentNotification,
  sendTaskAssigneeNotification
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
  const data = { href, recipientName };
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
  const data = { href, ...comment };
  const html = renderHtml(path.join(templatesDir, 'comment.mjml'), data);
  const text = renderText(path.join(templatesDir, 'comment.txt'), data);
  logger.info({ recipients, sender: from }, '📧  Sending notification email to:', recipients);
  return send({
    from,
    to: recipients,
    subject: `${comment.author.label} left a comment on ${comment.repositoryName}`,
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function sendTaskAssigneeNotification(assignee, task) {
  const recipients = assignee;
  const html = renderHtml(path.join(templatesDir, 'task.mjml'), task);
  const text = renderText(path.join(templatesDir, 'task.txt'), task);
  logger.info({ recipients, sender: from }, '📧  Sending notification email to:', recipients);
  return send({
    from,
    to: recipients,
    subject: `You've been assigned task "${task.name}."`,
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
