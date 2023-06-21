import 'dotenv/config';
import { defineConfig } from 'cypress';
import serverConfig from './config/server/index.js';

export default defineConfig({
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
