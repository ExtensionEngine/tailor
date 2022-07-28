import {
  createRootActivity,
  findActivityItem,
  generateActivityName
} from './utils';

const ROOT_ACTIVIY_TYPES = ['Module', 'Page'];
const createdActivities = [];

describe('ability to create root activities', () => {
  before(function () {
    cy.visit('/');
    cy.login();
    cy.createRepository().its('id').as('repositoryId');
  });

  beforeEach(function () {
    cy.visit('/');
    cy.login();
    cy.openRepository(this.repositoryId);
    cy.assertRoute('repository');
    ROOT_ACTIVIY_TYPES.forEach(type => {
      const rootName = generateActivityName(type);
      createRootActivity(rootName, type);
      createdActivities.push(rootName);
    });
  });

  it('should delete all root activities', function () {
    createdActivities.forEach(it => {
      findActivityItem(it).click().within(() => {
        cy.get('div[class="options-menu"]').click();
      });
      cy.findAllByRole('menuitem').contains('Remove')
        .click();
      cy.confirmAction('Delete item?');
      findActivityItem(it).should('not.exist');
    });
  });
});
