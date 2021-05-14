'use strict';

const sel = {
  list: 'catalog__repositories',
  card: 'catalog__repositoryCard',
  createBtn: 'catalog__createRepositoryBtn',
  createDialog: 'catalog__createRepositoryDialog',
  settings: 'catalog__repositorySettingsBtn'
};

function findRepositoryByName(name) {
  return cy.findAllByTestId(sel.card)
    .filter(`:contains("${name}")`)
    .eq(0);
}

function createRepository(name, description) {
  cy.findByTestId(sel.createBtn).click();
  cy.findByTestId(sel.createDialog).within(() => {
    cy.findByLabelText(/name/i)
      .type(name);
    cy.findByLabelText(/description/i)
      .type(description);
    cy.findByText(/create/i)
      .click();
  });
}

module.exports = {
  selectors: sel,
  findRepositoryByName,
  createRepository
};
