import { findRepositoryCard, searchRepository } from './utils.js';

describe('ability to search and filter repository catalog', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.visit('#/');
    cy.assertRoute('catalog');
  });

  it('should be able to search for the repository', () => {
    cy.createRepository().then(name => {
      searchRepository(name);
      findRepositoryCard(name).should('have.length', 1);
    });
  });
});
