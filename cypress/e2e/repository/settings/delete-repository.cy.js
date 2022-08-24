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

  it('should be able to delete the repository', function () {
    cy.findByRole('button', { name: 'delete' }).click();
    cy.confirmAction('Delete repository?');
    cy.assertRoute('catalog');
    findRepositoryCard(this.repository.name).should('not.exist');
  });
});
