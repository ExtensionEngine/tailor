const assertHomepageAccess = () => {
  cy.location()
    .should(location => expect(location.hash).to.eq('#/'));
};

describe('Sign in view', () => {
  beforeEach(() => cy.visit('/'));

  it('should sign in an existing user', () => {
    cy.findByLabelText(/email/i)
      .type(Cypress.env('USERNAME'));
    cy.findByLabelText(/password/i)
      .type(Cypress.env('PASSWORD'));
    cy.findByText(/Log In$/i)
      .click();
    assertHomepageAccess();
  });

  it('should sign in an existing user by dispatching an action', () => {
    cy.login();
    cy.visit('/');
    assertHomepageAccess();
  });
});
