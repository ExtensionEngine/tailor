import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const courses = state => {
  const { sort } = state.$internals;
  const items = state.showPinned
    ? filter(state.items, it => get(it, 'courseUser.pinned'))
    : state.items;
  return orderBy(items, sort.field, sort.order.toLowerCase());
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
