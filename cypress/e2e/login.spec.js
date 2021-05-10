describe('login', () => {
  it('should login an existing user', () => {
    cy.visit('/');
    cy.findByLabelText(/email/i)
      .type('admin@example.com');
    cy.findByLabelText(/password/i)
      .type('admin123.');
    cy.findByText(/log in/i)
      .click();
  });
});
