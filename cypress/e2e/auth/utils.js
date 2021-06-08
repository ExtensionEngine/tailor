'use strict';

const { getActor } = require('../../fixtures/users');

function login(user = getActor()) {
  cy.visit('/');
  cy.getStore()
    .then(store => cy.wrap(store.dispatch('login', user)));
  cy.visit('/');
}

function logout() {
  return cy.getStore()
    .then(store => cy.wrap(store.dispatch('logout')));
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
  loginWithUI,
  logout
};
