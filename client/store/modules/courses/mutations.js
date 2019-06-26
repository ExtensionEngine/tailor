import {
  add,
  fetch,
  remove,
  reset,
  setBaseUrl,
  update
} from '../../helpers/mutations';
import Vue from 'vue';

const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

const resetPagination = state => {
  state.$internals.pagination = PAGINATION_DEFAULTS;
};

const save = (state, course) => {
  const search = state.search.toLowerCase();
  const name = course.name.toLowerCase();
  if (search && !name.includes(search)) return;
  Vue.set(state.items, course._cid, course);
};

const setPagination = (state, changes) => {
  let $internals = state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
};

const setSearch = (state, query = '') => {
  state.$internals.pagination = PAGINATION_DEFAULTS;
  state.search = query;
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
  save,
  setPagination,
  setSearch,
  setBaseUrl,
  update
};
