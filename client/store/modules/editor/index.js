import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  isPublishedPreview: false
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
