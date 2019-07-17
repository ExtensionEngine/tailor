import filter from 'lodash/filter';
import get from 'lodash/get';

export const courses = state => {
  if (!state.showPinned) return Object.values(state.items);
  return filter(state.items, it => get(it, 'courseUser.pinned'));
};

export const courseQueryParams = state => {
  const { pagination, sort } = state.$internals;
  const { search, showPinned } = state;

  return {
    search,
    offset: pagination.offset,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field,
    ...{
      pinned: showPinned || undefined
    }
  };
};

export const hasMoreResults = state => !state.$internals.allCoursesFetched;
