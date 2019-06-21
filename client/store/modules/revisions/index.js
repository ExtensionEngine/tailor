import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';
import Resource from '../../helpers/resource';

const PAGINATION_DEFAULTS = { offset: 0, limit: 21 };

const state = {
  api: new Resource(),
  items: {},
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    allRevisionsFetched: false
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
