export const generateActivityName = type => `${type} - ${(new Date()).getTime()}`;

export function createRootActivity(name, type) {
  cy.findByTestId('repository__createRootActivityBtn').click();
  return getRootActivityDialog().within(() => {
    cy.vSelect('Type', type);
    cy.findByLabelText('Name').type(`${name}{enter}`);
    cy.findByRole('button', { name: /create/i }).click();
  });
}

export function getRootActivityDialog() {
  return cy.findByTestId('repository__createRootActivityDialog');
}
