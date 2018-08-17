'use strict';

require('dotenv').load();

const config = {
  url: process.env.POSTGRES_URI,
  dialect: 'postgres'
};

module.exports = {
  development: config,
  test: config,
  production: config
};
