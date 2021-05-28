'use strict';

const { getActor } = require('../../fixtures/users');

function login(user = getActor()) {
  return cy.getStore()
    .then(store => store.dispatch('login', user));
}

function loginWithUI(user = getActor()) {
  cy.findByLabelText(/email/i)
    .type(user.email);
  cy.findByLabelText(/password/i)
    .type(user.password);
  cy.findByText(/log in/i)
    .click();
}

module.exports = {
  login,
  loginWithUI
};
