import { findRepositoryCard, searchRepository } from './utils.js';

describe('ability to search and filter repository catalog', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
    cy.createRepository().then(repo => {
      cy.wrap(repo).its('name').as('name');
    });
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should be able to search for the repository', () => {
    cy.get('@name').then(name => {
      searchRepository(name);
      findRepositoryCard(name).should('have.length', 1);
    });
  });
});
