import { toTestIdAttr } from '../../../utils';

const sel = {
  activityItem: 'repository__structureActivity',
  addRootDialog: 'repository__createRootActivityDialog',
  addRootBtn: 'repository__createRootActivityBtn'
};

export const generateActivityName = type => `${type} - ${(new Date()).getTime()}`;

export const getRootActivityDialog = () => cy.findByTestId(sel.addRootDialog);

export function createRootActivity(name, type) {
  cy.findByTestId(sel.addRootBtn).click();
  return getRootActivityDialog().within(() => {
    cy.vSelect('Type', type);
    cy.findByLabelText('Name').type(`${name}{enter}`);
    cy.findByRole('button', { name: /create/i }).click();
  });
}

export function findActivityItem(name) {
  return cy.contains(toTestIdAttr(sel.activityItem), name, { timeout: 6000 });
}
