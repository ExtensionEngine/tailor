import sortBy from 'lodash/sortBy';
import VuexCollection from '../helpers/collection';

const { getter, build } = new VuexCollection('comments');

getter(function comments() {
  return sortBy(this.state.items, 'createdAt');
}, { global: true });

export default build();
