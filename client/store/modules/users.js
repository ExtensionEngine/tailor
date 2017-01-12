import { VuexModule } from 'vuex-module';

import UserAPI from '../../api/users';

const { action, build, getter, mutation, state } = new VuexModule('users');

state({
  // TODO(marko): mock user
  user: {
    email: 'admin@example.com',
    role: 'SYSTEM_ADMIN'
  },
  users: [],
  filters: {
    search: ''
  }
});

action(function listUser() {
  UserAPI.list()
    .then(resp => {
      this.commit('addUsers', resp.data.data);
    })
    .catch(error => {
      console.log(error);
    });
});

action(function setSearchFilter(search) {
  this.commit('setSearchFilter', search);
});

// TODO(marko): mock action
action(function addUserToCourse(data) {
  this.commit('addUserToCourse', data);
});

// TODO(marko): mock action
action(function updateUserRole(data) {
  this.commit('updateUserRole', data);
});

getter(function user() {
  return this.state.user;
});

getter(function totalUsers() {
  return this.state.users.length;
});

getter(function filteredUsers() {
  const { users, filters } = this.state;
  const pattern = new RegExp(filters.search, 'i');
  return users.filter(u => pattern.test(u.email));
});

// TODO(marko): temporarily add user to store
// currently ignores course until the endpoint
// gets implemented
mutation(function addUserToCourse(data) {
  const _key = Math.random().toString(10).substring(2, 8);
  const { email, role } = data;
  this.state.users.push({ _key, email, role });
});

mutation(function addUsers(users) {
  this.state.users = users;
});

mutation(function setSearchFilter(search) {
  this.state.filters.search = search;
});

// TODO(marko): mock mutation
mutation(function updateUserRole(data) {
  this.state.users = this.state.users.map(
    user => {
      if (user._key === data.userKey) user.role = data.role;
      return user;
    }
  );
});

export default build();
