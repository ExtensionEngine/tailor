import Vue from 'vue';
import { isEmpty, values } from 'lodash';
import VuexModel from '../helpers/model.js';
import courseApi from '../../api/course';
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

action(function fetchUsers(courseKey) {
  const userSearch = this.context.getters.userSearch;
  const params = !isEmpty(userSearch) ? { search: userSearch } : {};

  return courseApi.getUsers(courseKey, params)
    .then(users => {
      let result = {};
      users.forEach(it => {
        this.api.setCid(it);
        result[it._cid] = it;
      });

      this.commit('fetchUsers', result);
    });
});

action(function updateRole(data) {
  const { userKey, role } = data;
  return usersApi.patch(userKey, { role })
    .then(user => {
      this.api.setCid(user);
      this.commit('saveUser', user);
    });
});

action(function invite(data) {
  const { courseKey, email, role } = data;
  return courseApi.invite(courseKey, { email, role })
    .then(user => {
      this.api.setCid(user);
      this.commit('saveUser', user);
    });
});

action(function revoke(data) {
  const { courseKey, userKey } = data;
  return courseApi.revoke(courseKey, userKey)
    .then(user => {
      const cid = this.api.getCid(user._key);
      this.commit('removeUser', cid);
    });
});

mutation(function setUserSearch(query) {
  this.state.search = query;
});

mutation(function fetchUsers(users) {
  this.state.users = users;
});

mutation(function saveUser(user) {
  Vue.set(this.state.users, user._cid, user);
});

mutation(function removeUser(cid) {
  Vue.delete(this.state.users, cid);
});

export default build();
