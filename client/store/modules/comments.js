import cuid from 'cuid';
import filter from 'lodash/filter';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';
import SSEClient from '../../SSEClient';
import Vue from 'vue';
import VuexCollection from '../helpers/collection';

const { action, getter, state, mutation, build } = new VuexCollection('comments');
let SSE_CLIENT;

state({
  courseId: '',
  activitiesFetched: {}
});

getter(function comments() {
  const activityId = this.rootGetters['course/activity'].id;
  const activityComments = filter(this.state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
}, { global: true });

getter(function commentsCount() {
  return Object.keys(this.rootGetters.comments).length;
});

getter(function commentsFetched() {
  const activityId = this.rootGetters['course/activity'].id;
  return !!this.state.activitiesFetched[activityId];
});

action(function fetch({ activityId }) {
  const { courseId } = this.rootState.route.params;
  let action = this.state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') this.commit('setCourse', courseId);
  this.api.fetch({ activityId })
    .then(result => this.commit(action, result))
    .then(result => this.commit('commentsFetched', activityId));
});

action(function subscribe() {
  if (SSE_CLIENT) return;
  SSE_CLIENT = new SSEClient(`/api/v1${this.state.$baseUrl}/subscribe`);
  SSE_CLIENT.subscribe('comment_create', item => this.commit('sseAdd', item));
  SSE_CLIENT.subscribe('comment_update', item => this.commit('sseUpdate', item));
  SSE_CLIENT.subscribe('comment_delete', item => this.commit('sseUpdate', item));
});

action(function unsubscribe() {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
});

action(function remove(comment) {
  // Update locally and let real data update be pushed from server
  // after soft delete
  comment.deletedAt = new Date();
  this.commit('update', comment);
  return this.api.remove(comment);
});

mutation(function setCourse(courseId) {
  this.state.courseId = courseId;
  this.state.activitiesFetched = {};
});

mutation(function commentsFetched(activityId) {
  Vue.set(this.state.activitiesFetched, activityId, true);
});

mutation(function sseAdd(comment) {
  const { id } = comment;
  if (find(this.state.items, { id })) return;
  comment._cid = cuid();
  Vue.set(this.state.items, comment._cid, comment);
});

mutation(function sseUpdate(comment) {
  const existing = find(this.state.items, { id: comment.id });
  if (!existing) return;
  const data = pick(comment, ['content', 'createdAt', 'updatedAt', 'deletedAt']);
  const updated = Object.assign({}, existing, data);
  Vue.set(this.state.items, updated._cid, updated);
});

export default build();
