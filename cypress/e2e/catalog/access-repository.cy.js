import { findRepositoryCard } from './utils';

describe('ability to access repository', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.createRepository().its('name').as('name');
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should access repository', () => {
    cy.get('@name').then(name => {
      findRepositoryCard(name).click();
      cy.assertRoute('repository');
    });
  });

  it('should access repository settings', () => {
    cy.get('@name').then(name => {
      findRepositoryCard(name)
        .findByRole('button', { name: 'Repository settings' })
        .click();
      cy.assertRoute('repository-info');
    });
  });
});
