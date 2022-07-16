import { findRepositoryCard } from './utils';

const sel = {
  addTagBtn: 'catalog__addTagBtn',
  addTagDialog: 'catalog__addTagDialog',
  tagChip: 'catalog__tagChip'
};

const TAG_NAME = '___Test tag___';

function addTag(repositorySelector, tagName) {
  cy.get(repositorySelector)
    .findByRole('button', { name: 'Add tag' })
    .click();
  cy.root()
    .findByTestId(sel.addTagDialog)
    .findByLabelText(/select a tag or add a new one/i)
    .type(`${tagName}{enter}`);
}

function removeTag(repositorySelector, tagName) {
  cy.get(repositorySelector)
    .findByText(tagName)
    .closest(`[data-testid="${sel.tagChip}"]`)
    .findByRole('button')
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
