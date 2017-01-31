import find from 'lodash/find';
import forEach from 'lodash/forEach';
import Vue from 'vue';
import VuexCollection from '../helpers/collection.js';

const { action, build, getter, mutation } = new VuexCollection('activity');

getter(function activities() {
  return this.state.items;
}, { global: true });

action(function reorder({ from, to, parentId }) {
  const activityId = find(this.state.items,
    it => it.parent_id === parentId && it.position === from).id;
  return this.api
    .post(`${activityId}/actions/reorder`, { position: to })
    .then(() => this.commit('reorder', { from, to, parentId }));
});

mutation(function reorder({ from, to, parentId }) {
  const isMovingToLargerPos = from < to;
  const low = isMovingToLargerPos ? from - 1 : to - 1;
  const high = isMovingToLargerPos ? to + 1 : from;
  const step = isMovingToLargerPos ? -1 : 1;

  Object.keys(this.state.items).forEach(key => {
    const item = this.state.items[key];
    if (item.parent_id !== parentId) return;

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
    forEach(this.state.items, it => {
      if ((it.parent_id === model.parent_id) && (it.position >= model.position)) {
        it.position += 1;
      }
    });
  }

  // Update the state after local save, and after successful save on server.
  Vue.set(this.state.items, model._cid, model);
});

mutation(function remove(result) {
  const root = result[0];
  forEach(this.state.items, it => {
    if ((it.parentKey === root.parentKey) && (it.position > root.position)) {
      it.position -= 1;
    }
  });

  result.forEach(it => Vue.delete(this.state.items, it._cid));
});

export default build();
