import Vue from 'vue';
import { values } from 'lodash';
import VuexModel from '../helpers/model.js';
import usersApi from '../../api/users';

const { state, getter, action, mutation, build } = new VuexModel('course');

// TODO(marko): offline mode support should probably have
// different state structure.
state({
  search: '',
  users: {}
});

getter(function users() {
  return this.state.users;
});

getter(function userCount() {
  return values(this.state.users).length;
});

// TODO(marko): Temporary. Should be mapped with mapState.
getter(function userSearch() {
  return this.state.search;
});

action(function fetchUsersForCourse(courseKey) {
  return usersApi.fetchUsersForCourse(courseKey)
    .then(users => {
      let result = {};
      users.forEach(it => {
        this.api.setCid(it);
        result[it._cid] = it;
      });

      this.commit('fetchUsersForCourse', result);
    });
});

action(function changeUserRole(userKey, role) {
  return usersApi.changeUserRole(userKey, role)
    .then(user => {
      this.api.setCid(user);
      this.commit('saveUser', user);
    });
});

mutation(function setUserSearch(query) {
  this.state.search = query;
});

mutation(function fetchUsersForCourse(users) {
  this.state.users = users;
});

mutation(function saveUser(user) {
  Vue.set(this.state.users, user._cid, user);
});

export default build();
