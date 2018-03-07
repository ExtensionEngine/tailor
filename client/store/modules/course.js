import courseApi from '../../api/course';
import filter from 'lodash/filter';
import find from 'lodash/find';
import { getOutlineLevels } from 'shared/activities';
import values from 'lodash/values';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

const { build, getter, action, mutation, state } = new VuexModule('course');
const COURSE_ROUTE = /\/course\/\d+/;

state({
  activity: undefined,
  users: {},
  outline: { expanded: {} }
});

getter(function course() {
  const { route } = this.rootState;
  const { courses } = this.rootGetters;
  if (!route.fullPath.match(COURSE_ROUTE)) return;
  const id = Number(route.params.courseId);
  return find(courses, { id });
});

getter(function structure() {
  const { route } = this.rootState;
  const { courses } = this.rootGetters;
  if (!route.fullPath.match(COURSE_ROUTE)) return [];
  const course = find(courses, { id: Number(route.params.courseId) });
  return getOutlineLevels(course.schema);
});

getter(function activities() {
  const { route } = this.rootState;
  const { activities: collection } = this.rootGetters;
  const id = Number(route.params.courseId);
  return filter(collection, { courseId: id });
});

getter(function activity() {
  const { activities } = this.rootGetters;
  return activities[this.state.activity] || {};
});

getter(function isCollapsed(activity) {
  const { outline } = this.state;
  return activity => activity && !outline.expanded[activity._cid];
});

getter(function assets() {
  const { route } = this.rootState;
  if (route.name !== 'editor') return;
  return this.rootGetters.assets;
});

getter(function users() {
  return values(this.state.users);
});

getter(function revisions() {
  const { route } = this.rootState;
  const courseId = Number(route.params.courseId);
  const revs = this.rootGetters.revisions;
  return filter(revs, { courseId })
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
});

action(function getUsers() {
  const { route } = this.rootState;
  const courseId = route.params.courseId;
  return courseApi.getUsers(courseId)
    .then(users => this.commit('setUsers', users));
});

action(function upsertUser({ courseId, email, role }) {
  return courseApi.upsertUser(courseId, { email, role })
    .then(user => this.commit('upsertUser', user));
});

action(function removeUser({ courseId, userId }) {
  return courseApi.removeUser(courseId, userId)
    .then(() => this.commit('removeUser', userId));
});

mutation(function upsertUser(user) {
  Vue.set(this.state.users, user.id, user);
});

mutation(function removeUser(id) {
  Vue.delete(this.state.users, id);
});

mutation(function setUsers(users) {
  this.state.users = {};
  users.forEach(it => Vue.set(this.state.users, it.id, it));
});

mutation(function toggleActivity({ _cid, expanded }) {
  let expandedItems = this.state.outline.expanded;
  expanded = expanded === undefined ? !expandedItems[_cid] : expanded;
  Vue.set(expandedItems, _cid, expanded);
});

mutation(function focusActivity(_cid) {
  this.state.activity = _cid;
});

export default build();
