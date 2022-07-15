const generateRepositoryName = () => `Test repository - ${new Date.getTime()}`;

Cypress.Commands.add('createRepository', (name = generateRepositoryName()) => {
  cy.getSchema().as('schema');
  return cy.getStore()
    .invoke('dispatch', 'repositories/create', {
      schema: this.schema.id,
      name,
      description: 'Test repository'
    })
    .then(() => name)
});
