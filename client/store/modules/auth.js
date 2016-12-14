import Promise from 'bluebird';
import { VuexModule } from 'vuex-module';
const { action, build, getter, mutation, state } = new VuexModule();

// TODO: Temp, integrate with backend
state({
  user: JSON.parse(window.localStorage.getItem('CGMA_AUTHOR_USER')) || {}
});

getter(function user() {
  let res = this.state.user;
  return res.email ? res : null;
});

// TODO: integrate with backend
action(function login(email, password) {
  return new Promise((resolve, reject) => {
    this.commit('login');
    resolve();
  });
});

action(function logout() {
  this.commit('logout');
});

// TODO: integrate with backend
action(function resetPassword(email) {
});

mutation(function login() {
  this.state.user = {
    email: 'tomitto@yorke.com',
    firstName: 'Thom',
    lastName: 'Yorke'
  };
});

mutation(function logout() {
  this.state.user = {};
});

export default build();
