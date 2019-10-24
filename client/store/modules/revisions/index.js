import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const PAGINATION_DEFAULTS = { offset: 0, limit: 25 };

const state = {
  items: {},
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    allRevisionsFetched: false
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
