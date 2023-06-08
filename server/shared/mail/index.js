import { mail as config, origin } from '../../../config/server/index.js';
import { createLogger, Level } from '../../shared/logger.js';
import { fileURLToPath, URL } from 'node:url';
import { renderHtml, renderText } from './render.js';
import email from 'emailjs';
import path from 'node:path';
import pick from 'lodash/pick.js';
import { promisify } from 'node:util';
import urlJoin from 'url-join';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logger = createLogger('mailer', { level: Level.DEBUG });

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
// NOTE: Enable SMTP tracing if DEBUG is set.
server.smtp.debug(Number(Boolean(process.env.DEBUG)));
logger.info(getConfig(server), '📧  SMTP client created');

const send = promisify(server.send.bind(server));
const templatesDir = path.join(__dirname, './templates/');

const resetUrl = token => urlJoin(origin, '/#/reset-password/', token);
const activityStatusUrl = (repositoryId, activityId) =>
  urlJoin(origin, '/#/repository', `${repositoryId}/progress?activityId=${activityId}`);
const activityUrl = ({ repositoryId, activityId }) =>
  urlJoin(origin, '/#/repository', `${repositoryId}?activityId=${activityId}`);
const elementUrl = ({ repositoryId, activityId, elementUid }) => {
  const query = `${activityId}?elementId=${elementUid}`;
  return urlJoin(origin, '/#/repository', `${repositoryId}/editor`, query);
};

export default {
  send,
  invite,
  resetPassword,
  sendCommentNotification,
  sendAssigneeNotification
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
  const { elementUid, author, repositoryName, topic, action } = comment;
  const href = elementUid ? elementUrl(comment) : activityUrl(comment);
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
  return send({
    from,
    to: recipients,
    subject: `${author.label} ${action} a comment on ${repositoryName} - ${topic}`,
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function sendAssigneeNotification(assignee, activity) {
  const recipients = assignee;
  const data = {
    ...activity,
    origin,
    href: activityStatusUrl(activity.repositoryId, activity.id)
  };
  const html = renderHtml(path.join(templatesDir, 'assignee.mjml'), data);
  const text = renderText(path.join(templatesDir, 'assignee.txt'), data);
  logger.info({ recipients, sender: from }, '📧  Sending notification email to:', recipients);
  return send({
    from,
    to: recipients,
    subject: `You've been assigned to the ${activity.label} "${activity.data.name}".`,
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
