const loginUserRequest = state => state.loginUser.request;
const loginUserMessage = state => state.loginUser.message;
const loginUserSuccess = state => state.loginUser.success;
const resetPasswordMessage = state => state.resetPassword.message;

export default {
  loginUserRequest,
  loginUserMessage,
  loginUserSuccess,
  resetPasswordMessage
};
