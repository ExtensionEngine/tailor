const chance = require('chance').Chance();

Cypress.Commands.add('createRepository', (name = chance.sentence({ words: 5 })) => {
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
