const toTestIdAttr = val => `[data-testid="${val}"]`

export const sel = {
  card: 'catalog__repositoryCard'
};

export const findRepositoryCard = val => cy.contains(toTestIdAttr(sel.card), val);
export const searchRepository = val => cy.findByPlaceholderText(/search/i).type(val);
