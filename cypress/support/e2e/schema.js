Cypress.Commands.add('getTestSchemaId', () => {
  return cy.window().its('__test_schema_id__');
});

Cypress.Commands.add('getSchemaService', () => {
  return cy.getApp().its('_provided.$schemaService');
});

Cypress.Commands.add('getTestSchema', () => {
  return cy.getSchemaService()
    .then(service => cy.getTestSchemaId().then(service.getSchema));
});
