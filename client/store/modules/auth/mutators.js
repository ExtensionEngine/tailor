import authMutations from './mutation-types';
import { asyncState } from '../../../utils/async';

const state = {
  ...asyncState.REQUEST,
  message: null
};

// TODO: Placeholders, replace with real mutators
const mutations = {
  [authMutations.LOGIN_FAILURE](state, { message }) {
    state = Object.assign(state, {
      ...asyncState.FAILURE,
      message
    });
  },

  [authMutations.LOGIN_REQUEST](state) {
    state = Object.assign(state, {
      ...asyncState.REQUEST,
      message: null
    });
  },

  [authMutations.LOGIN_SUCCESS](state) {
    state = Object.assign(state, {
      ...asyncState.SUCCESS,
      message: null
    });
  }
};

export { mutations, state };
