'use strict';

const { login, loginWithUI } = require('./utils');

const assertHomepageAccess = () => {
  cy.visit('/');
  cy.getRoute()
    .then(route => expect(route.name).to.equal('catalog'));
};

describe('auth', () => {
  it('should login an existing user using login view', () => {
    cy.visit('/');
    loginWithUI();
    assertHomepageAccess();
  });

  it('should login an existing user by dispatching an action', () => {
    login();
    assertHomepageAccess();
  });
});
