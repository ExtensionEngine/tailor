import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  activity: undefined,
  outline: { expanded: {}, showOptions: null },
  users: {},
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
