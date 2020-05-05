import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  activeUsers: {},
  sseId: null,
  repositoryId: null,
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
