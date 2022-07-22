import isArray from 'lodash/isArray';

Cypress.Commands.add('vSelect', (inputLabel, optionLabels) => {
  optionLabels = isArray(optionLabels) ? optionLabels : [optionLabels];
  // Show the dropdown menu
  cy.findByLabelText(inputLabel)
    .as('vSelectLabel')
    .closest("div[role='button']")
    .click({ force: true });
  // TODO: Consider implementation with attach attr to improve scoping
  optionLabels.forEach(optionLabel =>
    cy.findByRole('option', { name: optionLabel }).click({ force: true }));
  // Close the dropdown (menu)
  cy.get('@vSelectLabel')
    .closest('.v-input')
    .parent()
    .click({ force: true });
});
