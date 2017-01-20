import courseApi from '../../api/course';
import VuexCollection from '../helpers/collection.js';

const { getter, action, build } = new VuexCollection('users', '/users');

getter(function users() {
  return this.state.items;
}, { global: true });

action(function fetch(courseKey) {
  const request = courseApi.getUsers(courseKey);
  request.then(users => {
    let result = {};
    users.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });
    this.commit('fetch', result);
  });
});

action(function addToCourse(params) {
  const { courseKey, email, role } = params;
  return courseApi.addUser(courseKey, { email, role })
    .then(user => {
      this.api.setCid(user);
      this.commit('save', user);
    });
});

action(function removeFromCourse(params) {
  const { courseKey, userKey } = params;
  return courseApi.removeUser(courseKey, userKey)
    .then(user => {
      this.api.setCid(user);
      this.commit('save', user);
    });
});

export default build();
