export const revisions = state => state.items;

export const revisionQueryParams = state => {
  const { pagination } = state.$internals;
  return pagination;
};

export const hasMoreResults = state => !state.$internals.allRevisionsFetched;
