'use strict';

const sel = {
  addTagBtn: 'catalog__addTagBtn',
  addTagDialog: 'catalog__addTagDialog'
};

function addTag(repositoryCard, tagName) {
  repositoryCard.within(() => {
    cy.findByTestId(sel.addTagBtn)
      .click();
  });
  cy.findByTestId(sel.addTagDialog).within(() => {
    cy.findByLabelText(/select a tag or add a new one/i)
      .type(`${tagName}{enter}`);
  });
}

module.exports = {
  addTag,
  selectors: sel
};
