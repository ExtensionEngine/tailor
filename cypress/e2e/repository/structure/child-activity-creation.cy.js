import {
  createRootActivity,
  findActivityItem,
  generateActivityName,
  getActivityDialog
} from '../../../utils/repository';

const PARENT_TYPE = 'Module';
const CHILD_ACTIVITY_TYPES = ['Module', 'Lesson', 'Knowledge check', 'Page'];

describe('ability to create child activities', () => {
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
    const name = generateActivityName(PARENT_TYPE);
    createRootActivity(name, PARENT_TYPE);
    findActivityItem(name).as('parent');
  });

  CHILD_ACTIVITY_TYPES.forEach(type => {
    it(`create and delete a "${type}" activity within "${PARENT_TYPE}" activity using the add into button`, function () {
      cy.get(this.parent).findByRole('button', { name: /add item into/i }).click();
      const name = generateActivityName(type);
      getActivityDialog().within(() => {
        cy.vSelect('Type', type);
        cy.findByLabelText('Name').type(`${name}{enter}`);
        cy.findByRole('button', { name: /create/i }).click();
      });
      findActivityItem(name).within(() => {
        cy.get('div[class="options-menu"]').click();
      });
      cy.findAllByRole('menuitem').contains('Remove')
        .click();
      cy.confirmAction('Delete item?');
      findActivityItem(name).should('not.exist');
    });
  });
});
