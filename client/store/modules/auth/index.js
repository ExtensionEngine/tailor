import * as actions from './actions';
import * as getters from './getters';
import * as mutations from './mutations';

const state = {
  loading: new Deferred(),
  user: null
};

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
};

function Deferred() {
  this.promise = new Promise(resolve => (this.resolve = resolve));
}
