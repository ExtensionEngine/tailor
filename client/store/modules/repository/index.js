import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import activities from './activities';
import comments from './comments';
import revisions from './revisions';
import tes from './tes';

const state = {
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
    revisions,
    tes
  }
};
