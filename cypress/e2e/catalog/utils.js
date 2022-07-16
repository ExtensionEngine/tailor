export const sel = {
  list: 'catalog__repositories',
  card: 'catalog__repositoryCard',
  createDialog: 'catalog__createRepositoryDialog',
  searchInput: 'catalog__searchInput'
};

const toTestIdAttr = val => `[data-testid="${val}"]`

export const findRepositoryCard = val => cy.contains(toTestIdAttr(sel.card), val);
export const getCreateDialog = () => cy.findByTestId(sel.createDialog);
export const searchRepository = text => cy.findByTestId(sel.searchInput).type(text);
