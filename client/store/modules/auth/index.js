import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  user: null,
  authData: null
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
};
