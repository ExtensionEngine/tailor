'use strict';

const sel = {
  addTagBtn: 'catalog__addTagBtn',
  addTagDialog: 'catalog__addTagDialog',
  tagChip: 'catalog__tagChip'
};

function addTag(repositorySelector, tagName) {
  cy.get(repositorySelector)
    .findByTestId(sel.addTagBtn)
    .click();
  cy.root()
    .findByTestId(sel.addTagDialog)
    .findByLabelText(/select a tag or add a new one/i)
    .type(`${tagName}{enter}`);
}

function removeTag(repositorySelector, tagName) {
  cy.get(repositorySelector)
    .findByText(tagName)
    .closest(`[data-testid="${sel.tagChip}"]`)
    .findByRole('button')
    .click();
}

module.exports = {
  addTag,
  removeTag,
  selectors: sel
};
