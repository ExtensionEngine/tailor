// App instance and routing
Cypress.Commands.add('getApp', () => cy.window().its('__app__'));
Cypress.Commands.add('getStore', () => cy.getApp().its('$store'));
Cypress.Commands.add('getRoute', () => cy.getApp().its('$route'));
Cypress.Commands.add('getRouteName', () => cy.getRoute().its('name'));
Cypress.Commands.add('assertRoute', name => cy.getRouteName().should('eq', name))

// Confirmation dialog actions
Cypress.Commands.add('confirmAction', dialogTitle => {
  return getDialogByTitle(dialogTitle)
    .findByText(/confirm/i)
    .click();
});
Cypress.Commands.add('cancelAction', dialogTitle => {
  return getDialogByTitle(dialogTitle)
    .findByText(/cancel/i)
    .click();
});

const getDialogByTitle = dialogTitle => {
  return cy.root()
    .findAllByRole('document')
    .filter(`:contains("${dialogTitle}")`)
    .eq(0);
};
