'use strict';

const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1400,
  viewportHeight: 800,
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e/index.js',
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    }
  }
});
