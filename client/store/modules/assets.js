import VuexModel from '../helpers/model.js';
const { getter, build } = new VuexModel('assets', '/assets');

getter(function assets() {
  return this.state.items;
}, { global: true });

export default build();
