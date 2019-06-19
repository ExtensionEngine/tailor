import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  courseId: '',
  activitiesFetched: {},
  items: {},
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
