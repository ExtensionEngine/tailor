import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  items: {},
  activitiesFetched: {},
  courseId: null,
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
