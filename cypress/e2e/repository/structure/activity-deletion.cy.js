import {
  createChildActivity,
  createRootActivity,
  findActivityItem,
  generateActivityName
} from './utils';

const ROOT_ACTIVIY_TYPES = ['Module', 'Page'];
const CHILD_ACTIVITY_TYPES = ['Module', 'Lesson', 'Knowledge check', 'Page'];

const createdParent = [];
const createdChild = [];

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

    ROOT_ACTIVIY_TYPES.forEach(type => {
      const rootName = generateActivityName(type);
      createRootActivity(rootName, type);
      createdParent.push(rootName);
      if (type === 'Module') {
        CHILD_ACTIVITY_TYPES.forEach(type => {
          const childName = generateActivityName(type);
          createChildActivity(rootName, childName, type);
          createdChild.push(childName);
        });
      }
    });
  });

  it('should delete all activity types', function () {
    createdChild.forEach(it => {
      clickActivityRemove(it);
      cy.confirmAction('Delete item?');
      findActivityItem(it).should('not.exist');
    });
    createdParent.forEach(it => {
      clickActivityRemove(it);
      cy.confirmAction('Delete item?');
      findActivityItem(it).should('not.exist');
    });
  });
});

function clickActivityRemove(name) {
  findActivityItem(name).click().within(() => {
    cy.get('div[class="options-menu"]').click();
  });
  cy.findAllByRole('menuitem').contains('Remove')
    .click();
}
