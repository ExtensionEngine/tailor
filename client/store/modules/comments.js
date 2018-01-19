import filter from 'lodash/filter';
import Vue from 'vue';
import VuexCollection from '../helpers/collection';

const { action, getter, state, mutation, build } = new VuexCollection('comments');

state({
  courseId: '',
  commentsFetched: {}
});

getter(function comments() {
  const activityId = this.rootGetters['course/activity'].id;
  return filter(this.state.items, c => c.activityId === activityId);
}, { global: true });

getter(function commentsCount() {
  return Object.keys(this.getters.comments).length;
});

getter(function commentsFetched() {
  const activityId = this.rootGetters['course/activity'].id;
  return !!this.state.commentsFetched[activityId];
});

action(function fetch({ activityId }) {
  const { courseId } = this.rootState.route.params;
  let action = 'fetch';
  if (this.state.courseId !== courseId) {
    this.commit('setCourseId', courseId);
    action = 'reset';
  };
  this.api.fetch({ activityId })
    .then(result => this.commit(action, result))
    .then(result => this.commit('setCommentsFetched', activityId));
});

mutation(function setCourseId(courseId) {
  this.state.courseId = courseId;
});

mutation(function setCommentsFetched(activityId) {
  Vue.set(this.state.commentsFetched, activityId, true);
});

export default build();
