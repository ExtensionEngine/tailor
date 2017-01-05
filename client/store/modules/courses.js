import VuexModel from '../helpers/model.js';
const { state, getter, mutation, build } = new VuexModel('courses', '/courses');

state({
  ...state,
  search: ''
});

getter(function courses() {
  return this.state.items;
}, { global: true });

mutation(function setSearch(search) {
  this.state.search = search;
});

export default build();
