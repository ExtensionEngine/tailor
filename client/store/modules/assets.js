import VuexCollection from '../helpers/collection.js';
import reorder from '../../utils/reorder.js';

const { action, getter, build } = new VuexCollection('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

action(reorder);

export default build();
