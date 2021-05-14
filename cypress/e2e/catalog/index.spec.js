'use strict';

const {
  createRepository,
  findRepositoryByName,
  selectors: repository
} = require('./repository.js');
const auth = require('../auth/utils');

describe('repository catalog', () => {
  beforeEach(() => {
    auth.login()
      .then(() => cy.visit('/'));
  });

  it('should create a repository', () => {
    createRepository('Test repository', 'Test description');
  });

  it('should access repository', () => {
    findRepositoryByName('Test repository').click();
  });

  it('should access repository settings', () => {
    findRepositoryByName('Test repository')
      .findByTestId(repository.settings)
      .click();
  });
});
