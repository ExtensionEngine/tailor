import { VuexModule } from 'vuex-module';
import authApi from '../../api/auth';

const { action, build, getter, mutation, state } = new VuexModule();

// TODO: Temp, integrate with backend
state({
  user: JSON.parse(window.localStorage.getItem('CGMA_AUTHOR_USER') || '{}')
});

getter(function user() {
  let res = this.state.user;
  return res.email ? res : null;
});

action(function login(credentials) {
  return authApi
    .login(credentials)
    .then(user => this.commit('login', user));
});

action(function logout() {
  return authApi
    .logout()
    .then(() => this.commit('logout'));
});

// TODO: integrate with backend
action(function resetPassword(email) {
});

mutation(function login(user) {
  this.state.user = user;
});

mutation(function logout() {
  this.state.user = {};
});

export default build();
