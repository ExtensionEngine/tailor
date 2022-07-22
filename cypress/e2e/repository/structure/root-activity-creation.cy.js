const ROOT_ACTIVIY_TYPES = ['Module', 'Page'];
const CHILD_ACTIVIY_TYPES = ['Lesson', 'Knowledge check'];

const generateActivityName = type => `${type} - ${(new Date()).getTime()}`;

function createActivity(name, type) {
  cy.findByRole('button', { name: /add/i }).click();
  cy.findByRole('dialog').within(() => {
    cy.vSelect('Type', type);
    cy.findByLabelText('Name').type(`${name}{enter}`);
    cy.findByRole('button', { name: /create/i }).click();
  });
}

describe('ability to create an outline', () => {
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
  });

  ROOT_ACTIVIY_TYPES.forEach(type => {
    it(`should create a "${type}" using the add button`, function () {
      const name = generateActivityName(type);
      createActivity(name, type);
      cy.findAllByText(name);
    });
  });

  CHILD_ACTIVIY_TYPES.forEach(type => {
    it(`should not be able to create a "${type}" using the add button`, () => {
      cy.findByRole('button', { name: /add/i }).click();
      cy.findByRole('dialog').within(() => {
        cy.findByLabelText('Type').click();
        cy.findByRole('option', { name: type }).should('not.exist');
      });
    });
  });
});
