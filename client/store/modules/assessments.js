import VuexCollection from '../helpers/collection.js';
const { getter, build } = new VuexCollection('assessments', '/assessments');

getter(function assessments() {
  return this.state.items;
}, { global: true });

export default build();
