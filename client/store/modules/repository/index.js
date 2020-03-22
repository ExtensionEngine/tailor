import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import activities from './activities';
import comments from './comments';
import elements from './elements';
import revisions from './revisions';

const state = {
  activity: undefined,
  outline: { expanded: {} },
  users: {},
  $apiUrl: null
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    activities,
    comments,
    elements,
    revisions
  }
};
