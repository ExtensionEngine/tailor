import * as actions from './actions';
import * as mutations from './mutations';

const state = {
  items: {},
  $internals: {},
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
