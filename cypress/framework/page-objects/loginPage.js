'use strict';

const selectors = require('../selectors');

function checkAlertMessage(message) {
  cy.xpath(selectors.login.alertContent).should('contain.text', message);
}

function login(username, password) {
  cy.xpath(selectors.login.emailInput).type(username);
  cy.xpath(selectors.login.passwordInput).type(password);
  cy.xpath(selectors.login.submitButton).click();
}

module.exports = {
  checkAlertMessage,
  login
};
