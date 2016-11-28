import authMutations from './mutation-types';

const state = {
  failure: false,
  request: true,
  success: false,
  message: ''
};

// TODO: Placeholders, replace with real mutators
const mutations = {
  [authMutations.LOGIN_FAILURE](state) {
    state = { ...state, failure: true, request: false, success: false };
  },

  [authMutations.LOGIN_REQUEST](state) {
    state = { ...state, failure: false, request: true, success: false };
  },

  [authMutations.LOGIN_SUCCESS](state) {
    state = { ...state, failure: false, request: false, success: true };
  }
};

export default { mutations, state };
