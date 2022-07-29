// App instance and routing
Cypress.Commands.add('getApp', () => cy.window().its('__app__'));
Cypress.Commands.add('getStore', () => cy.getApp().its('$store'));
Cypress.Commands.add('getRouter', () => cy.getApp().its('$router'));
Cypress.Commands.add('getRoute', () => cy.getApp().its('$route'));
Cypress.Commands.add('getRouteName', () => cy.getRoute().its('name'));
Cypress.Commands.add('assertRoute', name => cy.getRouteName().should('eq', name));
Cypress.Commands.add('navigateTo', route => cy.getRouter().then(router => {
  router.replace(route).then(route => {
    // TODO: Find a better way to make sure the components are loaded
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1);
    return route;
  });
}));

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
    .findAllByRole('dialog')
    .filter(`:contains("${dialogTitle}")`)
    .eq(0);
};
