import VuexCollection from '../helpers/collection.js';
const { getter, build } = new VuexCollection('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

export default build();
