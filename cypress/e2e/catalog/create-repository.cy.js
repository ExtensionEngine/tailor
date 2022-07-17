import { findRepositoryCard, getCreateDialog } from './utils';

describe('create repository', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.visit('#/');
    cy.assertRoute('catalog');
  });

  it('should be able to create a repository using the create dialog', () => {
    const repositoryName = `Test_repository_${(new Date).getTime()}`
    cy.findByRole('button', { name: 'Add repository' }).click();
    getCreateDialog().within(() => {
      cy.findByLabelText(/name/i)
        .type(repositoryName);
      cy.findByLabelText(/description/i)
        .type('Test description');
      cy.findByRole('button', { name: /create/i })
        .click();
    });
    findRepositoryCard(repositoryName);
  });
});
