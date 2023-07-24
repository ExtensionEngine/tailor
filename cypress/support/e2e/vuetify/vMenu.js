Cypress.Commands.add('vMenu', (inputLabel, option) => {
  cy.findByLabelText(inputLabel).parent().click();
  cy.findAllByRole('menuitem').contains(option).click();
});
