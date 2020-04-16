import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  items: {},
  $apiUrl: null,
  seenByActivity: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
