import { VuexModule } from 'vuex-module';

import UserAPI from '../../api/users';
import { asyncState } from '../../utils/async';

const { action, build, getter, mutation, state } = new VuexModule('users');

state({
  users: [],
  fetchUsers: {
    ...asyncState.INITIAL,
    message: null
  }
});

action(function fetchUsers() {
  this.commit('fetchUsersRequest');
  UserAPI.list()
    .then(resp => {
      this.commit('fetchUsersSuccess');
      this.commit('addUsers', resp.data.data);
    })
    .catch(error => {
      this.commit('fetchUsersFailure', error);
    });
});

getter(function users() {
  return this.state.users;
});

mutation(function addUsers(users) {
  this.state.users = users;
});

mutation(function fetchUsersFailure({ message }) {
  this.state.fetchUsers = { ...asyncState.FAILURE, message };
});

mutation(function fetchUsersRequest() {
  this.state.fetchUsers = { ...asyncState.REQUEST, message: null };
});

mutation(function fetchUsersSuccess() {
  this.state.fetchUsers = { ...asyncState.SUCCESS, message: null };
});

export default build();
