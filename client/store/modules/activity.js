import calculatePosition from '../../utils/calculatePosition.js';
import find from 'lodash/find';
import VuexCollection from '../helpers/collection.js';

const { getter, action, mutation, build } = new VuexCollection('activity');

getter(function activities() {
  return this.state.items;
}, { global: true });

getter(function getParent() {
  return activityId => {
    const activity = find(this.state.items, { id: activityId });
    return activity ? find(this.state.items, { id: activity.parentId }) : null;
  };
});

action(function reorder({ activity, context }) {
  this.commit('reorder', { activity, position: calculatePosition(context) });
  const data = { position: context.newPosition };
  return this.api.post(`${activity.id}/reorder`, data)
    .then(res => {
      let activity = res.data.data;
      this.api.setCid(activity);
      this.commit('save', activity);
    });
});

mutation(function reorder({ activity, position }) {
  activity.position = position;
});

export default build();
