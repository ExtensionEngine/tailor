export const revisions = state => state.items;

export const revisionQueryParams = state => state.$internals.pagination;

export const hasMoreResults = state => !state.$internals.allRevisionsFetched;
