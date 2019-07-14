export const courses = state => ({ ...state.pinned, ...state.items });

export const courseQueryParams = state => {
  const { pagination, sort } = state.$internals;
  const search = state.search;

  return {
    search,
    offset: pagination.offset,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field
  };
};

export const hasMoreResults = state => !state.$internals.allCoursesFetched;
