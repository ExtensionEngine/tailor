import Vue from 'vue';
import VuexCollection from '../helpers/collection.js';

const { action, build, getter, mutation } = new VuexCollection('activity');

getter(function activities() {
  return this.state.items;
}, { global: true });

action(function reorder({ activity, to }) {
  return this.api.post(`${activity.id}/reorder`, { position: to })
    .then(res => {
      let activity = res.data.data;
      this.api.setCid(activity);
      this.commit('save', activity);
    });
});

mutation(function activateCourse(courseKey) {
  this.url = `/courses/${courseKey}/activities`;
});

mutation(function save(model) {
  // Update the state after local save, and after successful save on server.
  Vue.set(this.state.items, model._cid, model);
});

mutation(function remove(result) {
  result.forEach(it => Vue.delete(this.state.items, it._cid));
});

export default build();
