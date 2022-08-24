import {
  findActivityItem
} from './utils';

describe('ability to delete child activities', () => {
  beforeEach(function () {
    cy.visit('/');
    cy.login();
    cy.createRepository()
      .as('repository')
      .then(({ id: repositoryId }) => {
        cy.seedActivities(repositoryId).as('activities');
        cy.openRepository(repositoryId);
      });
  });

  it('should be able to delete the module', function () {
    const { module } = this.activities;
    clickActivityRemove(module.data.name);
    cy.confirmAction('Delete item?');
    findActivityItem(module.data.name).should('not.exist');
  });
});

function clickActivityRemove(name) {
  findActivityItem(name).click().within(() => {
    cy.vMenu('additional options', /remove/i);
  });
}
