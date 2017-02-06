import each from 'lodash/each';
import VuexCollection from '../helpers/collection.js';
const { action, build, getter } = new VuexCollection('assessments');

getter(function assessments() {
  return this.state.items;
}, { global: true });

action(function fetch(params = {}) {
  return this.api.fetch(params)
    .then(result => {
      each(result, assessment => {
        each(assessment.data, (v, k) => { assessment[k] = v; });
        delete assessment.data;
      });
      this.commit('fetch', result);
    });
});

export default build();
