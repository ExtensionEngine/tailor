import { findRepositoryCard } from './utils';

const getDialog = () => cy.findByRole('dialog');
const chance = require('chance').Chance();

describe('create repository', () => {
  before(() => cy.visit('/'));

  beforeEach(() => {
    cy.login();
    cy.visit('/').then(() => cy.assertRoute('catalog'));
  });

  it('should create a new repository using the create dialog', () => {
    const repositoryName = `Repository - ${chance.sentence({ words: 5 })}`;
    cy.findByRole('button', { name: 'Add repository' }).click();
    getDialog().within(() => {
      cy.findByLabelText(/name/i)
        .type(repositoryName);
      cy.findByLabelText(/description/i)
        .type('Test description');
      cy.findByRole('button', { name: /create/i }).click();
    });
    findRepositoryCard(repositoryName);
  });
});
