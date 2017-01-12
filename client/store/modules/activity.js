import values from 'lodash/values';
import Vue from 'vue';
import VuexModule from '../helpers/model.js';

const { action, build, getter, mutation, state } = new VuexModule('activity');

state({
  items: {}
});

getter(function activities() {
  return this.state.items;
}, { global: true });

action(function reorder({ from, to, parentKey }) {
  const activityKey = values(this.state.items)
    .find(it => it.parentKey === parentKey && it.position === from)._key;
  return this.api
    .post(`${activityKey}/actions/reorder`, { position: to })
    .then(() => this.commit('reorder', { from, to, parentKey }));
});

mutation(function reorder({ from, to, parentKey }) {
  const isMovingToLargerPos = from < to;
  const low = isMovingToLargerPos ? from - 1 : to - 1;
  const high = isMovingToLargerPos ? to + 1 : from;
  const step = isMovingToLargerPos ? -1 : 1;

  Object.keys(this.state.items).forEach(key => {
    const item = this.state.items[key];
    if (item.parentKey !== parentKey) return;

    if (item.position === from) {
      item.position = to;
      return;
    }

    if (item.position > low && item.position < high) {
      item.position += step;
    }
  });
});

mutation(function activateCourse(courseKey) {
  this.url = `/courses/${courseKey}/activities`;
});

mutation(function save(model) {
  // Recalculate positions only once - after model is saved locally.
  if (!this.state.items[model._cid]) {
    Object.keys(this.state.items).forEach(key => {
      const item = this.state.items[key];
      if ((item.parentKey === model.parentKey) && (item.position >= model.position)) {
        item.position += 1;
      }
    });
  }

  // Update the state after local save, and after successful save on server.
  Vue.set(this.state.items, model._cid, model);
});

mutation(function remove(result) {
  const root = result[0];
  Object.keys(this.state.items).forEach(key => {
    const item = this.state.items[key];
    if ((item.parentKey === root.parentKey) && (item.position > root.position)) {
      item.position -= 1;
    }
  });

  result.forEach(it => Vue.delete(this.state.items, it._cid));
});

export default build();
