Cypress.Commands.add('login', () => {
  return cy.getStore()
    .invoke('dispatch', 'login', {
      email: Cypress.env('USERNAME'),
      password: Cypress.env('PASSWORD')
    });
});

Cypress.Commands.add('logout', () => {
  return cy.getStore()
    .invoke('dispatch', 'logout');
});
