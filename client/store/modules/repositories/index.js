import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

const state = {
  items: {},
  search: '',
  showPinned: false,
  tags: [],
  selectedTags: [],
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    sort: {
      order: 'DESC',
      field: 'createdAt'
    },
    allRepositoriesFetched: false
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
