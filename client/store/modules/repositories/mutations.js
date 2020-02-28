import { add, fetch, remove, reset, setEndpoint } from '@/store/helpers/mutations';
import find from 'lodash/find';
import findKey from 'lodash/findKey';
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

const addTag = (state, { tag, repositoryId }) => {
  const repository = find(state.items, { id: repositoryId });
  if (!findKey(state.tags, { id: tag.id })) state.tags = [...state.tags, tag];
  if (!findKey(repository.tags, { id: tag.id })) repository.tags = [...repository.tags, tag];
};

const removeTag = (state, { tagId, repositoryId }) => {
  const repository = find(state.items, { id: repositoryId });
  repository.tags = repository.tags.filter(it => it.id !== tagId);
};

const toggleTagFilter = (state, tag) => {
  resetPagination(state);
  state.tagFilter = tag.isSelected
    ? [...state.tagFilter, tag]
    : state.tagFilter.filter(it => it.id !== tag.id);
};

const removeAllTagFilters = state => {
  resetPagination(state);
  state.tagFilter = [];
};

export {
  add,
  allRepositoriesFetched,
  fetch,
  fetchTags,
  remove,
  removeTag,
  removeAllTagFilters,
  reset,
  resetPagination,
  resetFilters,
  save,
  addTag,
  setEndpoint,
  setPagination,
  setOrder,
  setSearch,
  toggleTagFilter,
  togglePinned
};
