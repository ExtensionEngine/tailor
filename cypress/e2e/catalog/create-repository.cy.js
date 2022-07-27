import { findRepositoryCard } from '../../utils/catalog';
import { generateRepositoryName } from '../../support/e2e/repository';

const getDialog = () => cy.findByRole('dialog');
const repositoryName = generateRepositoryName();

describe('create and delete repository', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should create a new repository using the create dialog', () => {
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

  it('should delete previously created repository', () => {
    findRepositoryCard(repositoryName)
      .findByRole('button', { name: 'Repository settings' })
      .click();
    cy.assertRoute('repository-info');
    cy.findAllByRole('listitem').contains('Delete')
      .click();
    cy.confirmAction('Delete repository?');
    cy.assertRoute('catalog');
    cy.visit('/');
    findRepositoryCard(repositoryName).should('not.exist');
  });
});
