import { add, fetch, remove, reset, setEndpoint } from '../../helpers/mutations';
import find from 'lodash/find';
import Vue from 'vue';

const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

const save = (state, repository) => {
  const search = state.search && state.search.toLowerCase();
  const name = repository.name.toLowerCase();
  if (search && !name.includes(search)) return;
  Vue.set(state.items, repository._cid, repository);
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

const allRepositoriesFetched = (state, allFetched) => {
  state.$internals.allRepositoriesFetched = allFetched;
};

const fetchTags = (state, tags) => {
  state.tags = tags;
};

const saveTags = (state, { tags, data }) => {
  const repo = find(state.items, { id: data.repositoryId });
  const isAdded = find(state.tags, { id: tags.tag.id });
  if (!isAdded) state.tags = [...state.tags, tags.tag];
  repo.tags = [...repo.tags, tags.tag];
};

const removeTag = (state, tag) => {
  const repo = find(state.items, { id: tag.repositoryId });
  repo.tags = repo.tags.filter(it => it.id !== tag.tagId);
};

export {
  add,
  allRepositoriesFetched,
  fetch,
  fetchTags,
  remove,
  removeTag,
  reset,
  resetPagination,
  resetFilters,
  save,
  saveTags,
  setEndpoint,
  setPagination,
  setOrder,
  setSearch,
  togglePinned
};
