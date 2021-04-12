const pages = require('../framework/pages')

before(() => {
  cy.preserveCookies();
});
after(() => {
  cy.deleteCookies();
});

describe('Login with incorrect credentials', () => {
  it('Open page', function () {
    cy.visit(this.myCredentials.url);
  });

  it('Login', function () {
    pages.loginPage.login("random@email.com", "randomPassword");
  });

  it('Check alert message', function () {
    pages.loginPage.checkAlertMessage("The email or password you entered is incorrect.");
  })
});
