const selectors = require('../selectors');

function login(username, password) {
  cy.xpath(selectors.login.emailInput).type(username);
  cy.xpath(selectors.login.passwordInput).type(password);
  cy.xpath(selectors.login.submitButton).click();
}

module.exports = {
  login
};
