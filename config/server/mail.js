'use strict';

const yn = require('yn');

module.exports = {
  sender: {
    name: process.env.EMAIL_SENDER_NAME,
    address: process.env.EMAIL_SENDER_ADDRESS
  },
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || null,
  ssl: yn(process.env.EMAIL_SSL),
  tls: yn(process.env.EMAIL_TLS)
};
