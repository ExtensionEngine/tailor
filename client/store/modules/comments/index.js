import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  items: {},
  activitiesFetched: {},
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
