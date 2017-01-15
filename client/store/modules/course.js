import { values } from 'lodash';
import VuexModel from '../helpers/model.js';
import usersApi from '../../api/users';

const { state, getter, action, mutation, build } = new VuexModel('course');

// TODO(marko): offline mode support should probably have different structure?
state({
  search: ''
});

getter(function courseKey() {
  const ck = this.rootState.route.params.courseKey;
  return this.getters.courses[ck]._key;
}, { global: true });

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

// TODO(marko): Rename with something like 'setUserSearch' because
// course could contain other search filters
mutation(function setSearch(query) {
  this.state.search = query;
});

export default build();
