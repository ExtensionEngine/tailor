import cuid from 'cuid';
import filter from 'lodash/filter';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import SSEClient from '../../SSEClient';
import Vue from 'vue';
import VuexCollection from '../helpers/collection';

const { action, getter, state, mutation, build } = new VuexCollection('editors');

let SSE_CLIENT;

state({
  courseId: '',
  activitiesFetched: {}
});

getter(function editors() {
  // TODO: improve this?
  let courseActivityGetter = this.rootGetters['course/activity'];
  let activityId = courseActivityGetter && courseActivityGetter.id;

  if (!activityId) {
    let editorActivityGetter = this.rootGetters['editor/activity'];
    activityId = editorActivityGetter && editorActivityGetter.id;
  }

  if (!activityId) return [];

  return filter(this.state.items, { activityId: Number(activityId) });
}, { global: true });

getter(function editorCount() {
  return Object.keys(this.rootGetters.editors).length;
});

getter(function editorsFetched() {
  let courseActivityGetter = this.rootGetters['course/activity'];
  let activityId = courseActivityGetter && courseActivityGetter.id;

  if (!activityId) {
    let editorActivityGetter = this.rootGetters['editor/activity'];
    activityId = editorActivityGetter && editorActivityGetter.id;
  }

  return !!this.state.activitiesFetched[Number(activityId)];
});

action(function fetch({ activityId }) {
  const { courseId } = this.rootState.route.params;
  let action = this.state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') this.commit('setCourse', courseId);

  this.api.fetch({ activityId })
    .then(result => this.commit(action, result))
    .then(() => this.commit('editorsFetched', activityId));
});

action(function subscribe({ activityId, editorId }) {
  if (!SSE_CLIENT) {
    let subscriptionUrl = `/api/v1${this.state.$baseUrl}/subscribe`;
    SSE_CLIENT = new SSEClient(subscriptionUrl);
    SSE_CLIENT.subscribe('editors_add', item => this.commit('sseAdd', item));
    SSE_CLIENT.subscribe('editors_remove', item => this.commit('sseRemove', item));
  }

  if (editorId) return this.api.post('/subscribe', { editorId, activityId });
});

action(function unsubscribe({ activityId, editorId }) {
  return new Promise(() => {
    if (!editorId) return Promise.resolve();
    return this.api.post('/unsubscribe', { editorId, activityId });
  })
    .then(() => {
      if (!SSE_CLIENT) return;
      SSE_CLIENT.disconnect();
    });
});

mutation(function setCourse(courseId) {
  this.state.courseId = courseId;
  this.state.activitiesFetched = {};
});

mutation(function editorsFetched(activityId) {
  Vue.set(this.state.activitiesFetched, activityId, true);
});

mutation(function sseAdd(editor) {
  const existing = find(this.state.items, { id: editor.id });

  if (!isEmpty(existing) && existing.activityId === editor.activityId) return;

  const newEditor = Object.assign({
    _cid: !isEmpty(existing) ? existing._cid || cuid() : cuid()
  }, editor);

  Vue.set(this.state.items, newEditor._cid, newEditor);
});

mutation(function sseRemove(editor) {
  const existing = find(this.state.items, { id: editor.id });
  if (!existing) return;

  Vue.delete(this.state.items, existing._cid);
});

export default build();
