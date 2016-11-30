import authMutations from './mutation-types';
import { asyncState } from '../../../utils/async';

const state = {
  loginUser: {
    ...asyncState.REQUEST,
    message: null
  },
  resetPassword: {
    ...asyncState.REQUEST,
    message: null
  }
};

// TODO: one mutator for every fetch?
const mutations = {
  [authMutations.LOGIN_FAILURE](state, { message }) {
    state.loginUser = Object.assign(state.loginUser, {
      ...asyncState.FAILURE,
      message
    });
  },

  [authMutations.LOGIN_REQUEST](state) {
    state.loginUser = Object.assign(state.loginUser, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [authMutations.LOGIN_SUCCESS](state) {
    state.loginUser = Object.assign(state.loginUser, {
      ...asyncState.SUCCESS,
      message: null
    });
  },

  [authMutations.RESET_PASSWORD_FAILURE](state, { message }) {
    state.resetPassword = Object.assign(state.resetPassword, {
      ...asyncState.FAILURE,
      message
    });
  },

  [authMutations.RESET_PASSWORD_REQUEST](state) {
    state.resetPassword = Object.assign(state.resetPassword, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [authMutations.RESET_PASSWORD_SUCCESS](state) {
    state.resetPassword = Object.assign(state.resetPassword, {
      ...asyncState.SUCCESS,
      message: null
    });
  }
};

export { mutations, state };
