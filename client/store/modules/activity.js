import VuexCollection from '../helpers/collection.js';
import reorder from '../../utils/reorder.js';

const { action, build, getter } = new VuexCollection('activity');

getter(function activities() {
  return this.state.items;
}, { global: true });

action(reorder);

export default build();
