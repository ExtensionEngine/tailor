export const generateRepositoryName = () => `Test repository - ${(new Date()).getTime()}`;

Cypress.Commands.add('createRepository', (name = generateRepositoryName()) => {
  return cy.getTestSchema().then(schema => {
    return cy.getStore().invoke('dispatch', 'repositories/create', {
      schema: schema.id,
      name,
      description: 'Test repository'
    });
  });
});

Cypress.Commands.add('openRepository', repositoryId => {
  return cy.getRouter()
    .then(router => router.push({ name: 'repository', params: { repositoryId } }));
});
