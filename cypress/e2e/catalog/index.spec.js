import { addTag, removeTag } from './tag';
import {
  createRepository,
  findRepositoryByName,
  interceptRepositoryFetch,
  removeRepository,
  selectors as repository,
  searchRepository
} from './repository.js';
import auth from '../auth/utils';
import forEach from 'lodash/forEach';

const TAG_NAME = '___Test tag___';
const REPOSITORY_NAME = '___Test repository___';

describe('repository catalog', () => {
  before(() => {
    auth.login();
    searchRepository(REPOSITORY_NAME);
    interceptRepositoryFetch().then(({ body }) => {
      forEach(body.data, removeRepository);
    });
    auth.logout();
  });

  beforeEach(() => {
    auth.login();
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

  it('should be able to search for the repository', () => {
    searchRepository(REPOSITORY_NAME);
    interceptRepositoryFetch();
    cy.findAllByTestId(repository.card)
      .then(repositories => expect(repositories).to.have.lengthOf(1));
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
    interceptRepositoryFetch();
    cy.contains(REPOSITORY_NAME)
      .should('not.exist');
  });
});
