import VuexModel from '../helpers/model.js';
const { state, getter, mutation, build } = new VuexModel('courses', '/courses');

state({
  search: ''
});

getter(function courses() {
  return this.state.items;
}, { global: true });

// TODO(marko): Move to 'courses' module.
getter(function courseKey() {
  const ck = this.rootState.route.params.courseKey;
  return this.state.items[ck]._key;
}, { global: true });

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
