Cypress.Commands.add('getTestSchemaId', () => {
  return cy.window().its('__test_schema_id__');
});

Cypress.Commands.add('getSchemaService', () => {
  return cy.getApp().then(app => app.$schemaService);
});

Cypress.Commands.add('getTestSchema', () => {
  return cy.getTestSchemaId().then(schemaId => {
    return cy.getSchemaService()
      .then(service => service.getSchema(schemaId))
  });
});



