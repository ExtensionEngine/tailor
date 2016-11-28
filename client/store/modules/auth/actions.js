import authMutations from './mutation-types';

// TODO: Dummy function for testing purposes (implement API call)
function loginUser({ commit }, { email, password }) {
  console.log('[LOGIN CREDENTIALS]: ', email, password);
  commit(authMutations.LOGIN_REQUEST);
  commit(authMutations.LOGIN_SUCCESS);
}

// TODO: Dummy function for testing purposes
function loginUserFail({ commit }) {
  commit(authMutations.LOGIN_REQUEST);
  commit(authMutations.LOGIN_FAILURE, { message: 'Login Failed' });
};

export default {
  loginUser,
  loginUserFail
};
