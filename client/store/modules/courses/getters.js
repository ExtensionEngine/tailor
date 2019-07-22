import isString from 'lodash/isString';
import orderBy from 'lodash/orderBy';

const processSortAttr = val => isString(val) ? val.toLowerCase() : val;

export const courses = ({ items, $internals }) => {
  const { sort: { field, order } } = $internals;
  return orderBy(items, it => processSortAttr(it[field]), order.toLowerCase());
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
