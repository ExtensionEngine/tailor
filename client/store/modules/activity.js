import values from 'lodash/values';
import VuexModel from '../helpers/model.js';

const { action, build, getter, mutation, state } = new VuexModel(
  'activity',
  '/courses/885350/activities' // hardcode the URL for now
);

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

export default build();
