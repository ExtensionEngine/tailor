import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import activities from './activities';
import comments from './comments';
import contentElements from './content-elements';
import revisions from './revisions';
import tasks from './tasks';

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
    contentElements,
    tasks,
    revisions
  }
};
