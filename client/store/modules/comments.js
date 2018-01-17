import filter from 'lodash/filter';
import VuexCollection from '../helpers/collection';

const { getter, build } = new VuexCollection('comments');

getter(function comments() {
  const activityId = this.rootGetters['course/activity'].id;
  return filter(this.state.items, c => c.activityId === activityId);
}, { global: true });

getter(function commentsCount() {
  return Object.keys(this.getters.comments).length;
});

export default build();
