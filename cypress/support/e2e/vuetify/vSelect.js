import isArray from 'lodash/isArray';

Cypress.Commands.add('vSelect', (inputLabel, optionLabels) => {
  optionLabels = isArray(optionLabels) ? optionLabels : [optionLabels];
  // Show the dropdown menu
  cy.findByLabelText(inputLabel)
    .closest("div[role='button']")
    .as('vSelectBtn')
    .click({ force: true });
  // TODO: Consider implementation with attach attr to improve scoping
  optionLabels.forEach(optionLabel =>
    cy.findByRole('option', { name: optionLabel }).click({ force: true }));
  // Close the dropdown (menu)
  cy.get('@vSelectBtn')
    .closest('.v-input')
    .parent()
    .click({ force: true });
});
