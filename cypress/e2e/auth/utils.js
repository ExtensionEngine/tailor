'use strict';

const { actor } = require('../../fixtures/users');

function login(user = actor) {
  return cy.getStore()
    .then(store => store.dispatch('login', user));
}

function loginWithUI(user = actor) {
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
