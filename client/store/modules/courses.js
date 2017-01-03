import VuexModel from '../helpers/model.js';
const { state, getter, action, mutation, build } = new VuexModel('courses', '/courses');

// TODO(marko): extend with default state
state({
  items: {},
  search: ''
});

getter(function courses() {
  return this.state.items;
}, { global: true });

getter(function search() {
  return this.state.search;
});

action(function setSearch(search) {
  this.commit('setSearch', search);
});

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
