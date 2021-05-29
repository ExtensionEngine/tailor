'use strict';

const { addTag, removeTag } = require('./tag');
const {
  createRepository,
  findRepositoryByName,
  selectors: repository
} = require('./repository.js');
const auth = require('../auth/utils');

const TAG_NAME = '___Test tag___';
const REPOSITORY_NAME = '___Test repository___';

describe('repository catalog', () => {
  beforeEach(() => {
    auth.login()
      .then(() => cy.visit('/'));
  });

  it('should create a repository', () => {
    createRepository(REPOSITORY_NAME, 'Test description');
  });

  it('should access repository', () => {
    findRepositoryByName(REPOSITORY_NAME).click();
  });

  it('should access repository settings', () => {
    findRepositoryByName(REPOSITORY_NAME)
      .findByTestId(repository.settings)
      .click();
  });

  it('should add a tag to the repository', () => {
    findRepositoryByName(REPOSITORY_NAME).as('repositoryCard');
    addTag('@repositoryCard', TAG_NAME);
    cy.get('@repositoryCard').findByText(TAG_NAME);
  });

  it('should delete a tag from the repository', () => {
    findRepositoryByName(REPOSITORY_NAME).as('repositoryCard');
    removeTag('@repositoryCard', TAG_NAME);
    cy.confirmAction('Delete tag');
  });

  it('should delete a repository', () => {
    findRepositoryByName(REPOSITORY_NAME).as('repositoryCard');
    cy.get('@repositoryCard')
      .findByTestId(repository.settings)
      .click();
    cy.findByText(/delete/i)
      .click();
    cy.confirmAction('Delete repository');
    cy.getRoute()
      .then(route => expect(route.name).to.equal('catalog'));
    cy.intercept('/api/repositories*').as('fetchRepositories');
    cy.wait('@fetchRepositories');
    cy.contains(REPOSITORY_NAME)
      .should('not.exist');
  });
});
