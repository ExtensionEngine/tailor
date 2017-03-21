import authApi from '../../api/auth';
import find from 'lodash/find';
import { role } from 'shared';
import { VuexModule } from 'vuex-module';

const { state, getter, action, mutation, build } = new VuexModule();

state({
  user: JSON.parse(window.localStorage.getItem('CGMA_AUTHOR_USER') || '{}')
});

getter(function user() {
  let res = this.state.user;
  return res.email ? res : null;
});

getter(function isAdmin() {
  const user = this.state.user;
  return user.role === role.user.ADMIN;
});

getter(function isCourseAdmin() {
  const { route } = this.rootState;
  const { courses } = this.rootGetters;
  const user = this.state.user;
  const course = find(courses, { _key: route.params.courseKey });
  return course && (course.users[user._key] === role.course.ADMIN);
});

getter(function isCourseAuthor() {
  const { route } = this.rootState;
  const { courses } = this.rootGetters;
  const user = this.state.user;
  const course = find(courses, { _key: route.params.courseKey });
  return course && (course.users[user._key] === role.course.AUTHOR);
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
      window.localStorage.removeItem('CGMA_AUTHOR_USER');
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
