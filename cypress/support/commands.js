// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getApp', () => cy.window().its('__app__'));
Cypress.Commands.add('getStore', () => cy.getApp().then(app => app.$store));
Cypress.Commands.add('getRoute', () => cy.getApp().then(app => app.$route));

// Auth actions via store
Cypress.Commands.add('login', () =>
  cy.getStore()
    .invoke('dispatch', 'login', {
      email: Cypress.env('USERNAME'),
      password: Cypress.env('PASSWORD')
    }));

Cypress.Commands.add('logout', () =>
  cy.getStore().invoke('dispatch', 'logout'));

// Manage cookies
Cypress.Commands.add('preserveSession', () => {
  Cypress.Cookies.defaults({
    preserve: ['auth', 'access_token', 'connect.sid']
  });
});
Cypress.Commands.add('resetCookieDefaults', () => {
  Cypress.Cookies.defaults({
    preserve: () => false
  });
});

Cypress.Commands.add('interceptFetch', (route, alias) => {
  cy.intercept(route, req => {
    delete req.headers['if-none-match'];
  }).as(alias);
  cy.wait(`@${alias}`);
  return cy.get(`@${alias}`).then(({ response }) => response);
});

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
