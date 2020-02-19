import { add, fetch, remove, reset, setEndpoint } from '@/store/helpers/mutations';
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

const addTag = (state, { tag, repo }) => {
  const repository = find(state.items, { id: repo[0].repositoryId });
  const isAdded = find(state.tags, { id: tag.id });
  if (!isAdded) state.tags = [...state.tags, tag];
  repository.tags = [...repository.tags, tag];
};

const removeTag = (state, { tagId, repositoryId }) => {
  const repository = find(state.items, { id: repositoryId });
  repository.tags = repository.tags.filter(it => it.id !== tagId);
};

const setTagFilter = (state, selectedTag) => {
  resetPagination(state);
  state.tagFilter = selectedTag.isSelected ? [...state.tagFilter, selectedTag]
    : state.tagFilter.filter(it => it.id !== selectedTag.id);
};

const removeTagFilter = (state, id) => {
  resetPagination(state);
  state.tagFilter = [...state.tagFilter.filter(it => it.id !== id)];
};

export {
  add,
  allRepositoriesFetched,
  fetch,
  fetchTags,
  remove,
  removeTag,
  removeTagFilter,
  reset,
  resetPagination,
  resetFilters,
  save,
  addTag,
  setEndpoint,
  setPagination,
  setOrder,
  setSearch,
  setTagFilter,
  togglePinned
};
