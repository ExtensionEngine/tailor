import { findRepositoryCard } from './utils';

const TAG_NAME = '___Test tag___';

function addTag(cardAlias, tagName) {
  cy.get(cardAlias)
    .findByRole('button', { name: 'Add tag' })
    .click();
  cy.findByRole('dialog')
    .findByLabelText(/select a tag or add a new one/i)
    .type(`${tagName}{enter}`);
}

function removeTag(cardAlias, tagName) {
  cy.get(cardAlias)
    .findByText(tagName)
    .closest('.v-chip')
    .findByRole('button', { name: /remove/i })
    .click();
}

describe('ability to access repository', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.createRepository().its('name').as('name')
    cy.visit('#/');
    cy.assertRoute('catalog');
  });

  it('should add a tag to the repository', () => {
    cy.get('@name').then(name => {
      findRepositoryCard(name).as('repositoryCard');
      addTag('@repositoryCard', TAG_NAME);
      cy.get('@repositoryCard').findByText(TAG_NAME);
    })
  });

  it('should delete a tag from the repository', () => {
    cy.get('@name').then(name => {
      findRepositoryCard(name).as('repositoryCard');
      addTag('@repositoryCard', TAG_NAME);
      removeTag('@repositoryCard', TAG_NAME);
      cy.confirmAction('Delete tag');
    });
  });
});
