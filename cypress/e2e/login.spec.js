describe('login', () => {
  it('should login an existing user', () => {
    cy.loginWithUI();
    cy.assertHome();
  });
});
