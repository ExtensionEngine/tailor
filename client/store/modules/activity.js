import find from 'lodash/find';
import VuexCollection from '../helpers/collection.js';
import { updatePosition } from '../../utils/activity.js';

const { action, build, getter } = new VuexCollection('activity');

getter(function activities() {
  return this.state.items;
}, { global: true });

getter(function getParent() {
  return activityId => {
    const activity = find(this.state.items, { id: activityId });
    return find(this.state.items, { id: activity.parentId });
  };
});

action(function reorder({ activity, positionData, index }) {
  activity.position = updatePosition(positionData);
  this.commit('save', activity);
  return this.api.post(`${activity.id}/reorder`, { position: index })
    .then(res => {
      let activity = res.data.data;
      this.api.setCid(activity);
      this.commit('save', activity);
    });
});

export default build();
