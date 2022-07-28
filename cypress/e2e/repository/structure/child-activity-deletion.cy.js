import {
  createChildActivity,
  createRootActivity,
  findActivityItem,
  generateActivityName
} from './utils';

const PARENT_TYPE = 'Module';
const CHILD_ACTIVITY_TYPES = ['Module', 'Lesson', 'Knowledge check', 'Page'];

const createdActivities = [];

describe('ability to delete child activities', () => {
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
    const parentName = generateActivityName(PARENT_TYPE);
    createRootActivity(parentName, PARENT_TYPE);
    findActivityItem(parentName).as('parent');
    CHILD_ACTIVITY_TYPES.forEach(type => {
      const childName = generateActivityName(type);
      createChildActivity(parentName, childName, type);
      createdActivities.push(childName);
    });
  });

  it(`should delete all child activities within "${PARENT_TYPE}" activity using the remove button`, function () {
    for (let i = 0; i < createdActivities.length; i++) {
      findActivityItem(createdActivities[i]).click().within(() => {
        cy.get('div[class="options-menu"]').click();
      });
      cy.findAllByRole('menuitem').contains('Remove')
        .click();
      cy.confirmAction('Delete item?');
      findActivityItem(createdActivities[i]).should('not.exist');
    }
  });
});
