import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import Resource from '../../helpers/resource';

const state = {
  api: new Resource(),
  courseId: '',
  activitiesFetched: {},
  items: {},
  $internals: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
