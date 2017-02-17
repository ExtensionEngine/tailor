import VuexCollection from '../helpers/collection.js';

const { build, getter } = new VuexCollection('revisions');

getter(function revisions() {
  return this.state.items;
}, { global: true });

export default build();
