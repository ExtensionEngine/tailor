import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  activity: undefined,
  items: {},
  users: {},
  outline: { expanded: {}, showOptions: null },
  $internals: {},
  $baseUrl: ''
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
