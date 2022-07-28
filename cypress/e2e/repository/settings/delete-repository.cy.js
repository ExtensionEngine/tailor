import { findRepositoryCard } from '../../catalog/utils';

describe('delete repository', () => {
  before(function () {
    cy.visit('/');
  });

  beforeEach(function () {
    cy.login();
    cy.visit('/').then(() => cy.assertRoute('catalog'));
    cy.createRepository().its('id').as('repositoryId');
  });

  it('should delete the repository from settings page', function () {
    cy.visit('/#/repository/' + this.repositoryId + '/settings');
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(5);
    cy.findAllByRole('listitem')
      .contains('Delete')
      .click('left');
    cy.confirmAction('Delete repository?');
    cy.assertRoute('catalog');
    cy.visit('/');
    findRepositoryCard(this.repositoryName)
      .should('not.exist');
  });
});
