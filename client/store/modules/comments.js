import cuid from 'cuid';
import filter from 'lodash/filter';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import pick from 'lodash/pick';
import SSEClient from '../../SSEClient';
import Vue from 'vue';
import VuexCollection from '../helpers/collection';

const { action, getter, state, mutation, build } = new VuexCollection('comments');
const PAGINATION_DEFAULTS = { offset: 0, limit: 12 };
let SSE_CLIENT;

state({
  path: '',
  activitiesFetched: {},
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    allCommentsFetched: false
  }
});

getter(function comments() {
  const activityId = this.rootGetters['course/activity'].id;
  const activityComments = filter(this.state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
}, { global: true });

getter(function courseComments() {
  return this.state.items;
}, { global: true });

getter(function commentQueryParams() {
  const { pagination } = this.state.$internals;
  return pagination;
}, { global: true });

getter(function hasMoreResults() {
  return !this.state.$internals.allCommentsFetched;
});

getter(function commentsCount() {
  return Object.keys(this.rootGetters.comments).length;
});

getter(function commentsFetched() {
  const activityId = this.rootGetters['course/activity'].id;
  return !!this.state.activitiesFetched[activityId];
});

action(function fetch({ activityId } = {}) {
  const params = activityId || this.context.getters.commentQueryParams;
  const { path } = this.context.rootState.route;
  let action = this.state.path === path ? 'fetch' : 'reset';
  if (action === 'reset') this.commit('setPath', path);
  return this.api.fetch(params)
    .then(result => {
      this.commit(action, result);
      if (!activityId) {
        const length = Object.keys(result).length;
        this.commit('setPagination', { offset: params.offset + params.limit });
        this.commit('allCommentsFetched', length < params.limit);
      } else { this.commit('commentsFetched', activityId); }
    });
});

action(function subscribe() {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
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

action(function resetPagination() {
  this.commit('setPagination', PAGINATION_DEFAULTS);
  this.commit('reset', {});
});

mutation(function setPath(path) {
  this.state.path = path;
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

mutation(function setPagination(changes) {
  let $internals = this.state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
});

mutation(function allCommentsFetched(allFetched) {
  this.state.$internals.allCommentsFetched = allFetched;
});

export default build();
