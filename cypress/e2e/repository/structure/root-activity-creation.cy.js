import {
  createRootActivity,
  findActivityItem,
  generateActivityName,
  getRootActivityDialog
} from './utils';

const ROOT_ACTIVIY_TYPES = ['Module', 'Page'];
const CHILD_ACTIVITY_TYPES = ['Lesson', 'Knowledge check'];

describe('ability to create root activities', () => {
  before(function () {
    cy.visit('/');
    cy.login();
    cy.createRepository().then(repo => {
      cy.wrap(repo).its('id').as('repositoryId');
    });
  });

  beforeEach(function () {
    cy.visit('/');
    cy.login();
    cy.openRepository(this.repositoryId);
    cy.assertRoute('repository');
  });

  ROOT_ACTIVIY_TYPES.forEach(type => {
    it(`should create a "${type}" activity using the add into button`, function () {
      const name = generateActivityName(type);
      createRootActivity(name, type);
      findActivityItem(name).should('be.visible');
    });
  });

  CHILD_ACTIVITY_TYPES.forEach(type => {
    it(`should not be able to create a "${type}" using the add button`, () => {
      cy.findByTestId('repository__createRootActivityBtn').click();
      getRootActivityDialog().within(() => {
        cy.findByLabelText('Type').click();
        cy.findByRole('option', { name: type }).should('not.exist');
      });
    });
  });
});
