import { toTestIdAttr } from '../../../utils';

const sel = {
  activityItem: 'repository__structureActivity',
  addDialog: 'repository__createActivityDialog',
  addRootDialog: 'repository__createRootActivityDialog',
  addRootBtn: 'repository__createRootActivityBtn'
};

const chance = require('chance').Chance();

export const getActivityDialog = () => cy.findByTestId(sel.addDialog);
export const getRootActivityDialog = () => cy.findByTestId(sel.addRootDialog);

export const generateActivityName = type => `${type} - ${chance.sentence({ words: 5 })}`;

export function createRootActivity(name, type) {
  cy.findByTestId(sel.addRootBtn).click();
  return getRootActivityDialog().within(() => {
    cy.vSelect('Type', type);
    cy.findByLabelText('Name').type(`${name}`);
    cy.findByRole('button', { name: /create/i }).click();
  });
}

export function findActivityItem(name) {
  return cy.contains(toTestIdAttr(sel.activityItem), name, { timeout: 6000 });
}
