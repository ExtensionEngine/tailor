const generateName = (prefix = 'Activity') => `${prefix} - ${(new Date()).getTime()}`;

const ACTIVITY_TYPES = {
  MODULE: 'TEST_SCHEMA/MODULE',
  LESSON: 'TEST_SCHEMA/LESSON',
  PAGE: 'TEST_SCHEMA/PAGE'
};

const SAVE_ACTIVITY_ACTION = 'repository/activities/save';
const SET_ENDPOINT_ACTION = 'repository/activities/setEndpoint';

Cypress.Commands.add('createActivity',
  (repositoryId, type, name = generateName(), parentId) => {
    const enpointUrl = `repositories/${repositoryId}/activities`;
    cy.getStore().invoke('dispatch', SET_ENDPOINT_ACTION, enpointUrl);
    return cy.getStore().invoke('dispatch', SAVE_ACTIVITY_ACTION, {
      repositoryId,
      parentId,
      type,
      position: 1,
      data: { name }
    });
  });

Cypress.Commands.add('seedActivities', repositoryId => {
  cy.createActivity(repositoryId, ACTIVITY_TYPES.MODULE, generateName('Module'))
    .then(module => {
      cy.createActivity(
        repositoryId,
        ACTIVITY_TYPES.LESSON,
        generateName('Lesson'),
        module.id
      ).then(lesson => ({ module, lesson }));
    });
});
