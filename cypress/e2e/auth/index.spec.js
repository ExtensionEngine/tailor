const { login, loginWithUI, logout } = require('./utils');

const assertHomepageAccess = () => {
  cy.location().should(loc => expect(loc.hash).to.eq('#/'));
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
    assertHomepageAccess();
  });
});
