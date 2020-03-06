export const revisionQueryParams = state => state.$internals.pagination;

export const hasMoreResults = state => !state.$internals.allRevisionsFetched;

export const items = state => {
  return Object.values(state.items)
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
};
