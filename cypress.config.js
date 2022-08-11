'use strict';

require('dotenv').config();

const { defineConfig } = require('cypress');
const serverConfig = require('./config/server');

module.exports = defineConfig({
  env: {
    USERNAME: process.env.CYPRESS_USERNAME,
    PASSWORD: process.env.CYPRESS_PASSWORD
  },
  e2e: {
    baseUrl: serverConfig.origin,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e/index.js'
  },
  viewportWidth: 1400,
  viewportHeight: 800
});
