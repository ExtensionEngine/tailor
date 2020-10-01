import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  sseId: null,
  repositoryId: null,
  users: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
