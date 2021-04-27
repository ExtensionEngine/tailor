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

/**
 * Enable cookie preservation during test run.
 */
Cypress.Commands.add('preserveCookies', () => {
  Cypress.Cookies.defaults({
    preserve: cookies => true
  });
});
/**
 * Disable cookie preservation during test run and delete cookies.
 */
Cypress.Commands.add('deleteCookies', () => {
  Cypress.Cookies.defaults({
    preserve: cookies => false
  });
  cy.clearCookies();
});
