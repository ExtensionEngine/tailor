import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import isString from 'lodash/isString';
import orderBy from 'lodash/orderBy';
import { role } from 'shared';

const processSortAttr = val => isString(val) ? val.toLowerCase() : val;
const isRepositoryAdmin = it => {
  return get(it, 'repositoryUser.role') === role.repository.ADMIN;
};

export const repositories = (state, _getters, _rootState, rootGetters) => {
  const items = state.showPinned
    ? filter(state.items, it => get(it, 'repositoryUser.pinned'))
    : state.items;
  forEach(items, it => {
    it.hasAdminAccess = rootGetters.isAdmin || isRepositoryAdmin(it);
  });
  const { sort: { field, order } } = state.$internals;
  return orderBy(items, it => processSortAttr(it[field]), order.toLowerCase());
};

export const repositoryQueryParams = state => {
  const { pagination, sort } = state.$internals;
  const { search, showPinned, tagFilter } = state;

  return {
    search,
    offset: pagination.offset,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field,
    ...{
      pinned: showPinned || undefined
    },
    tagIds: tagFilter.map(({ id }) => id)
  };
};

export const hasMoreResults = state => !state.$internals.allRepositoriesFetched;
