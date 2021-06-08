'use strict';

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

Cypress.Commands.add('getApp', () => cy.window().then(win => win.__app__));
Cypress.Commands.add('getStore', () => cy.getApp().then(app => app.$store));
Cypress.Commands.add('getRoute', () => cy.getApp().then(app => app.$route));

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
