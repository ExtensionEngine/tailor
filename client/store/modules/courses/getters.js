import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isString from 'lodash/isString';
import orderBy from 'lodash/orderBy';
import { role } from 'shared';

const isCourseAdmin = it => get(it, 'courseUser.role') === role.course.ADMIN;
const processSortAttr = val => isString(val) ? val.toLowerCase() : val;

export const courses = (state, _getters, _rootState, rootGetters) => {
  const items = state.showPinned
    ? filter(state.items, it => get(it, 'courseUser.pinned'))
    : state.items;
  forEach(items, it => {
    it.hasAdminAccess = rootGetters.isAdmin || isCourseAdmin(it);
  });
  const { sort: { field, order } } = state.$internals;
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
