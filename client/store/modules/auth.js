import authApi from '../../api/auth';
import { role } from 'shared';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule();

state({
  user: JSON.parse(window.localStorage.getItem('TAILOR_USER') || '{}')
});

getter(function user() {
  let res = this.state.user;
  return res.email ? res : null;
});

getter(function isAdmin() {
  const user = this.state.user;
  return user.role === role.user.ADMIN;
});

action(function login(credentials) {
  return authApi
    .login(credentials)
    .then(user => this.commit('login', user));
});

action(function logout() {
  return authApi
    .logout()
    .then(() => setTimeout(() => {
      window.localStorage.removeItem('TAILOR_USER');
      window.location.reload();
    }, 0));
});

action(function forgotPassword({ email }) {
  return authApi.forgotPassword(email);
});

action(function resetPassword({ token, password }) {
  return authApi.resetPassword(token, password);
});

mutation(function login(user) {
  this.state.user = user;
});

mutation(function logout() {
  this.state.user = {};
});

export default build();
