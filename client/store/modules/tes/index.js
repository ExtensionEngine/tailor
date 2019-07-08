import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  items: {},
  $internals: {},
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
