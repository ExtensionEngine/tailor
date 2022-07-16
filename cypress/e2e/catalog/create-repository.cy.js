import { findRepositoryByName, sel } from './utils';

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
    cy.findByTestId(sel.createDialog).within(() => {
      cy.findByLabelText(/name/i)
        .type(repositoryName);
      cy.findByLabelText(/description/i)
        .type('Test description');
      cy.findByText(/create/i)
        .click();
    });
    findRepositoryByName(repositoryName);
  });
});
