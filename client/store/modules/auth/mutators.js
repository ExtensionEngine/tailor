import authMutations from './mutation-types';

const state = {
  failure: false,
  request: true,
  success: false,
  message: null
};

// TODO: Placeholders, replace with real mutators
const mutations = {
  [authMutations.LOGIN_FAILURE](state, { message }) {
    state.message = message;
    state.failure = true;
    state.request = false;
  },

  [authMutations.LOGIN_REQUEST](state) {
    state.message = null;
    state.failure = false;
    state.request = true;
    state.success = false;
  },

  [authMutations.LOGIN_SUCCESS](state) {
    state.message = null;
    state.request = false;
    state.success = true;
  }
};

export { mutations, state };
