import authMutations from './mutation-types';

// TODO: dummy function for testing purposes (implement API call)
function loginUser({ commit }, { email, password }) {
  console.log('[LOGIN CREDENTIALS]: ', email, password);
  commit(authMutations.LOGIN_REQUEST);
  commit(authMutations.LOGIN_SUCCESS);
}

// TODO: dummy function for testing purposes
function loginUserFail({ commit }) {
  commit(authMutations.LOGIN_REQUEST);
  commit(authMutations.LOGIN_FAILURE, { message: 'Login Failed' });
};

// TODO: dummy function for testing purposes (implement API call)
function resetPassword({ commit }, email) {
  console.log('[RESET PASSWORD]: ', email);
  commit(authMutations.RESET_PASSWORD_REQUEST);
  commit(authMutations.RESET_PASSWORD_SUCCESS);
};

// TODO: dummy function for testing purposes
function resetPasswordFail({ commit }) {
  commit(authMutations.RESET_PASSWORD_REQUEST);
  commit(authMutations.RESET_PASSWORD_FAILURE, { message: 'Password reset failed' });
};

export default {
  loginUser,
  loginUserFail,
  resetPassword,
  resetPasswordFail
};
