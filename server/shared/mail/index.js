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
const mapKeys = require('lodash/mapKeys');
const util = require('util');

const from = `${config.sender.name} <${config.sender.address}>`;
const server = email.server.connect(config);
logger.info(getConfig(server), '📧  SMTP client created');

const send = promisify(server.send.bind(server));
const templatesDir = path.join(__dirname, './templates/');

const resetUrl = token => urlJoin(origin, '/#/reset-password/', token);

module.exports = {
  send,
  invite,
  resetPassword,
  sendCommentNotification,
  sendActivityDigest
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
  const recipients = users.concat(',');
  const html = renderHtml(path.join(templatesDir, 'comment.mjml'), comment);
  const text = renderText(path.join(templatesDir, 'comment.txt'), comment);
  logger.info({ recipients, sender: from }, '📧  Sending notification email to:', recipients);
  return send({
    from,
    to: recipients,
    subject: `${comment.author.label} left a comment on ${comment.repository}`,
    text,
    attachment: [{ data: html, alternative: true }]
  });
}

function sendActivityDigest(revisions) {
  mapKeys(revisions, (revision, user) => {
    // ovaj user u tom ovom mapkeys je recipient
    const data = { revision };

    // view model za template od maila
    const mustacheModel = {
      data: []
    };
    for (const prop in data.revision) {
      mustacheModel.data.push({
        repository: prop,
        revisions: data.revision[prop]
      });
    }

    // Ovaj dio broji sve operacije i zamini array sa brojen
    mustacheModel.data.map(elem => {
      mapKeys(elem.revisions, (value, key) => { elem.revisions[key] = elem.revisions[key].length; });
    });

    console.log(util.inspect(mustacheModel, true, null, false));
    const html = renderHtml(path.join(templatesDir, 'activity-digest.mjml'), data);

    // Renderan test.txt file a ne oni tvoji da mos ti nesto minjat po voli
    const text = renderText(path.join(templatesDir, 'test.txt'), mustacheModel);
    // logger.info({ recipient, sender: from }, '📧  Sending weekly activity digest email to:', recipient);
    // console.log(text);
    // return send({
    //   from,
    //   to: user,
    //   subject: 'Weekly activity digest',
    //   text,
    //   attachment: [{ data: text, alternative: true }]
    // });
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
