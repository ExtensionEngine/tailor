'use strict';

const sel = {
  list: 'catalog__repositories',
  card: 'catalog__repositoryCard',
  createBtn: 'catalog__createRepositoryBtn',
  createDialog: 'catalog__createRepositoryDialog',
  settings: 'catalog__repositorySettingsBtn',
  searchInput: 'catalog__searchInput'
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

function removeRepository(instance) {
  return cy.getStore()
    .then(store => cy.wrap(store.dispatch('repositories/remove', instance)));
}

function searchRepository(input) {
  cy.findByTestId(sel.searchInput)
    .type(input);
}

function interceptRepositoryFetch(alias = 'fetchRepositories') {
  return cy.interceptFetch('/api/repositories*', alias);
}

module.exports = {
  selectors: sel,
  findRepositoryByName,
  createRepository,
  removeRepository,
  searchRepository,
  interceptRepositoryFetch
};
