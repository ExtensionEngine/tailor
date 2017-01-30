import VuexCollection from '../helpers/collection.js';

const { getter, build } = new VuexCollection('users', '/users');

getter(function users() {
  return this.state.items;
}, { global: true });

export default build();
