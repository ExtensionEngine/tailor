import { VuexModule } from 'vuex-module';

import UserAPI from '../../api/users';
import { asyncState } from '../../utils/async';

const { action, build, getter, mutation, state } = new VuexModule('users');

state({
  // TODO: mock user
  user: {
    email: 'admin@example.com',
    role: 'global_admin'
  },
  users: [],
  listUserStatus: {
    ...asyncState.INITIAL,
    message: null
  }
});

action(function listUser() {
  this.commit('listUserRequest');
  UserAPI.list()
    .then(resp => {
      this.commit('listUserSuccess');
      this.commit('addUsers', resp.data.data);
    })
    .catch(error => {
      this.commit('listUserFailure', error);
    });
});

// TODO: mock action
action(function addUser(data) {
  console.log('add user: ', data);
});

// TODO: mock action
action(function updateUserRole(data) {
  console.log('update role: ', data);
});

getter(function user() {
  return this.state.user;
});

getter(function users() {
  return this.state.users;
});

mutation(function addUsers(users) {
  this.state.users = users;
});

mutation(function listUserFailure({ message }) {
  this.state.listUserStatus = { ...asyncState.FAILURE, message };
});

mutation(function listUserRequest() {
  this.state.listUserStatus = { ...asyncState.REQUEST, message: null };
});

mutation(function listUserSuccess() {
  this.state.listUserStatus = { ...asyncState.SUCCESS, message: null };
});

export default build();
