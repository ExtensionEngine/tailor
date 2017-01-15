import VuexModel from '../helpers/model.js';
const { getter, build } = new VuexModel('assessments', '/assessments');

getter(function assessments() {
  return this.state.items;
}, { global: true });

export default build();
