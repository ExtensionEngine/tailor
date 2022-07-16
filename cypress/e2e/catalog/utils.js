const toTestIdAttr = val => `[data-testid="${val}"]`

export const sel = {
  card: 'catalog__repositoryCard',
  createDialog: 'catalog__createRepositoryDialog',
  searchInput: 'catalog__searchInput'
};

export const findRepositoryCard = val => cy.contains(toTestIdAttr(sel.card), val);
export const getCreateDialog = () => cy.findByTestId(sel.createDialog);
export const searchRepository = text => cy.findByTestId(sel.searchInput).type(text);
