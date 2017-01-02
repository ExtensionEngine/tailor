import VuexModel from '../helpers/model.js';
const { getter, build } = new VuexModel('courses', '/courses');

getter(function courses() {
  return this.state.items;
}, { global: true });

export default build();
