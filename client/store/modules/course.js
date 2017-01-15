import { values } from 'lodash';
import VuexModel from '../helpers/model.js';
import usersApi from '../../api/users';

const { state, getter, action, mutation, build } = new VuexModel('course');

// TODO(marko): offline mode support should probably have different structure?
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

mutation(function setSearch(query) {
  this.state.search = query;
});

mutation(function fetchUsersForCourse(users) {
  this.state.users = users;
});

export default build();
