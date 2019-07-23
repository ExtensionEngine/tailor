import { add, fetch, remove, reset, setEndpoint } from '../../helpers/mutations';
import Vue from 'vue';

const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

const save = (state, course) => {
  const search = state.search && state.search.toLowerCase();
  const name = course.name.toLowerCase();
  if (search && !name.includes(search)) return;
  Vue.set(state.items, course._cid, course);
};

const togglePinned = state => {
  resetPagination(state);
  state.showPinned = !state.showPinned;
};

const setSearch = (state, query = '') => {
  resetPagination(state);
  state.search = query;
};

const setOrder = (state, order) => {
  resetPagination(state);
  state.$internals.sort = { ...state.$internals.sort, ...order };
};

const setPagination = (state, changes) => {
  const $internals = state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
};

const resetPagination = state => {
  state.$internals.pagination = { ...PAGINATION_DEFAULTS };
};

const resetFilters = state => {
  state.search = '';
  state.showPinned = false;
};

const allCoursesFetched = (state, allFetched) => {
  state.$internals.allCoursesFetched = allFetched;
};

export {
  add,
  allCoursesFetched,
  fetch,
  remove,
  reset,
  resetPagination,
  resetFilters,
  save,
  setEndpoint,
  setPagination,
  setOrder,
  setSearch,
  togglePinned
};
