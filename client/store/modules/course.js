import Vue from 'vue';
import { isEmpty, values } from 'lodash';
import VuexModel from '../helpers/model.js';
import usersApi from '../../api/users';

const { state, getter, action, mutation, build } = new VuexModel('course');

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

getter(function userSearch() {
  return this.state.search;
}, { global: true });

action(function fetchUsersForCourse(courseKey) {
  const userSearch = this.context.getters.userSearch;
  const params = !isEmpty(userSearch) ? { search: userSearch } : {};

  return usersApi.fetchUsersForCourse(courseKey, params)
    .then(users => {
      let result = {};
      users.forEach(it => {
        this.api.setCid(it);
        result[it._cid] = it;
      });

      this.commit('fetchUsersForCourse', result);
    });
});

action(function changeUserRole(data) {
  const { userKey, role } = data;
  return usersApi.changeUserRole(userKey, role)
    .then(user => {
      this.api.setCid(user);
      this.commit('saveUser', user);
    });
});

action(function inviteUserToCourse(data) {
  return usersApi.inviteUserToCourse(data)
    .then(user => {
      this.api.setCid(user);
      this.commit('saveUser', user);
    });
});

action(function revokeAccessToCourse(data) {
  const { userKey, courseKey } = data;
  return usersApi.revokeAccessToCourse(userKey, courseKey)
    .then(user => {
      const cid = this.api.getCid(user._key);
      this.commit('removeUser', cid);
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

mutation(function removeUser(cid) {
  console.log(cid);
  Vue.delete(this.state.users, cid);
});

export default build();
