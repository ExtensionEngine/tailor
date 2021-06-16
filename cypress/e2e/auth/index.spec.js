const { login, loginWithUI, logout } = require('./utils');

const assertHomepageAccess = () => {
  cy.location()
    .should(location => expect(location.hash).to.eq('#/'));
};

describe('auth', () => {
  beforeEach(() => cy.visit('/'));
  afterEach(() => logout());

  it('should login an existing user using login view', () => {
    loginWithUI();
    assertHomepageAccess();
  });

  it('should login an existing user by dispatching an action', () => {
    login();
    cy.visit('/');
    assertHomepageAccess();
  });
});
