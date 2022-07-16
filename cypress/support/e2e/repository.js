const generateRepositoryName = () => `Test repository - ${(new Date).getTime()}`;

Cypress.Commands.add('createRepository', (name = generateRepositoryName()) => {
  return cy.getTestSchema()
    .then(schema => {
      return cy.getStore()
        .invoke('dispatch', 'repositories/create', {
          schema: schema.id,
          name,
          description: 'Test repository'
        })
    })
});
