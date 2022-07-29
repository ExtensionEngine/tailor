import { findRepositoryCard } from '../../catalog/utils';

describe('delete repository', () => {
  before(function () {
    cy.visit('/');
  });

  beforeEach(function () {
    cy.login();
    cy.createRepository()
      .as('repository')
      .then(({ id: repositoryId }) => {
        cy.navigateTo({
          name: 'repository-info',
          params: { repositoryId }
        });
      });
  });

  it('should delete the repository from settings page', function () {
    cy.findByRole('button', { name: 'delete' }).click();
    cy.confirmAction('Delete repository?');
    cy.assertRoute('catalog');
    cy.visit('/');
    cy.get('@repository').then(({ name: repositoryName }) => {
      findRepositoryCard(repositoryName).should('not.exist');
    });
  });
});
