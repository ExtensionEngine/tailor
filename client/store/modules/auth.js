import { VuexModule } from 'vuex-module';
import { asyncState } from '../../utils/async';

const { action, build, getter, mutation, state } = new VuexModule('auth');

state({
  loginUser: {
    ...asyncState.REQUEST,
    message: null
  },
  resetPassword: {
    ...asyncState.REQUEST,
    message: null
  }
});

// TODO: sync with backend
action(function loginUser(email, password) {
  this.commit('loginRequest');
  this.commit('loginSuccess');
});

// NOTE: dummy action for testing purposes
action(function loginUserFail() {
  this.commit('loginRequest');
  this.commit('loginFailure', { message: 'Login failed' });
});

// TODO: sync with backend
action(function resetPassword(email) {
  this.commit('resetPasswordRequest');
  this.commit('resetPasswordSuccess');
});

// NOTE: dummy action for testing purposes
action(function resetPasswordFail() {
  this.commit('resetPasswordRequest');
  this.commit('resetPasswordFailure', { message: 'Password reset failed' });
});

getter(function loginUserStatus() {
  return this.state.loginUser;
});

getter(function resetPasswordStatus() {
  return this.state.resetPassword;
});

mutation(function loginFailure({ message }) {
  this.state.loginUser = { ...asyncState.FAILURE, message };
});

mutation(function loginRequest() {
  this.state.loginUser = { ...asyncState.REQUEST, message: null };
});

mutation(function loginSuccess() {
  this.state.loginUser = { ...asyncState.SUCCESS, message: null };
});

mutation(function resetPasswordFailure({ message }) {
  this.state.resetPassword = { ...asyncState.FAILURE, message };
});

mutation(function resetPasswordRequest() {
  this.state.resetPassword = { ...asyncState.REQUEST, message: null };
});

mutation(function resetPasswordSuccess() {
  this.state.resetPassword = { ...asyncState.SUCCESS, message: null };
});

export default build();
