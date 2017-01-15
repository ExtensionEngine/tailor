// TODO(marko): Separate courses and catalog modules. Rename this module
// to 'courses'.
import { values } from 'lodash';
import VuexModel from '../helpers/model.js';
import usersApi from '../../api/users';

const { state, getter, action, build } = new VuexModel('users', '/users');

// TODO(marko): offline mode support should probably have different structure?
state({
  search: ''
});

getter(function users() {
  return this.state.items;
});

getter(function userCount() {
  return values(this.state.items).length;
});

action(function fetchForCourse() {
  const courseKey = this.context.getters.courseKey;
  return usersApi.fetchUsersForCourse(courseKey)
    .then(users => {
      let result = {};
      users.forEach(it => {
        this.api.setCid(it);
        result[it._cid] = it;
      });

      this.commit('fetch', result);
    });
});

export default build();
