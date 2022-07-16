export const sel = {
  list: 'catalog__repositories',
  card: 'catalog__repositoryCard',
  createDialog: 'catalog__createRepositoryDialog',
  searchInput: 'catalog__searchInput'
};

export function findRepositoryByName(name) {
  return cy.contains(`[data-testid="${sel.card}"]`, name);
}
