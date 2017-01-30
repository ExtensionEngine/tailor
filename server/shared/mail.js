'use strict';

const email = require('emailjs');
const Promise = require('bluebird');

const SERVER_URL = process.env.SERVER_URL;
const EMAIL_ADDRESS = process.env.EMAIL_ADDRESS;

const server = email.server.connect({
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  ssl: true
});

function send(message) {
  return new Promise((resolve, reject) => {
    server.send(message, (err, msg) => err ? reject(err) : resolve(msg));
  });
}

function invite(user) {
  const link = `${SERVER_URL}/#/reset-password/${user.token}`;
  const message = `
    An account has been created for you on ${SERVER_URL}.
    Please click <a href="${link}">here</a> to complete your registration.`;

  return send({
    from: EMAIL_ADDRESS,
    to: user.email,
    subject: 'Invite',
    attachment: [{ data: `<html>${message}</html>`, alternative: true }]
  });
}

function resetPassword(user) {
  const link = `${SERVER_URL}/#/reset-password/${user.token}`;
  const message = `
    You requested password reset.
    Please click <a href="${link}">here</a> to complete the reset process.`;

  return send({
    from: EMAIL_ADDRESS,
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
