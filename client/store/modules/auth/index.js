import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  user: JSON.parse(window.localStorage.getItem('TAILOR_USER'))
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
};
