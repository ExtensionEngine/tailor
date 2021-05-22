'use strict';

const pages = require('../framework/pages');

before(() => {
  cy.preserveCookies();
});
after(() => {
  cy.deleteCookies();
});

describe('Login with correct credentials', () => {
  it('Open page', function () {
    cy.visit(this.myCredentials.url);
  });

  it('Login', function () {
    pages.loginPage.login(this.myCredentials.username, this.myCredentials.password);
  });
});
