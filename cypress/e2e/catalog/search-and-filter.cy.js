import { findRepositoryCard, searchRepository } from './utils.js';

describe('ability to search and filter repository catalog', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.createRepository().its('name').as('name');
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should be able to search for the repository', () => {
    cy.get('@name').then(name => {
      searchRepository(name);
      findRepositoryCard(name).should('have.length', 1);
    });
  });
});
