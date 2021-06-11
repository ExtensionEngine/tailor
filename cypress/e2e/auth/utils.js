const { getActor } = require('../../fixtures/users');

function login(user = getActor()) {
  cy.visit('/');
  cy.getStore().invoke('dispatch', 'login', user);
  cy.visit('/');
}

function logout() {
  return cy.getStore().invoke('dispatch', 'logout');
}

function loginWithUI(user = getActor()) {
  cy.findByLabelText(/email/i)
    .type(user.email);
  cy.findByLabelText(/password/i)
    .type(user.password);
  cy.findByText(/log in/i)
    .click();
}

export default {
  login,
  loginWithUI,
  logout
};
