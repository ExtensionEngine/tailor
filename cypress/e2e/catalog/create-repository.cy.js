import { findRepositoryCard } from './utils';

const getDialog = () => cy.findByRole('dialog');

describe('create repository', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.login();
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should create a new repository using the create dialog', () => {
    const repositoryName = `Test_repository_${(new Date()).getTime()}`;
    cy.findByRole('button', { name: 'Add repository' }).click();
    getDialog().within(() => {
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
