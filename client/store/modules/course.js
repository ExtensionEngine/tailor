import { getLevel, getOutlineLevels, getTesMeta } from 'shared/activities';
import compact from 'lodash/compact';
import courseApi from '../../api/course';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import transform from 'lodash/transform';
import values from 'lodash/values';
import Vue from 'vue';
import { VuexModule } from 'vuex-module';

const { build, getter, action, mutation, state } = new VuexModule('course');
const COURSE_ROUTE = /\/course\/\d+/;
// NOTE: teaching elements always have `activityId` foreign key and that is
//       how we can tell if an element is `tes` or `activity`
const isTes = element => !!element.activityId;

state({
  activity: undefined,
  users: {},
  outline: { expanded: {}, showOptions: null }
});

getter(function course() {
  const courseId = get(this.rootState, 'route.params.courseId');
  if (!courseId) return;
  if (!this.rootState.route.fullPath.match(COURSE_ROUTE)) return;
  return find(this.rootGetters.courses, { id: Number(courseId) });
});

getter(function structure() {
  const course = this.getters['course/course'];
  if (!course) return;
  return getOutlineLevels(course.schema);
});

getter(function activities() {
  const course = this.getters['course/course'];
  if (!course) return;
  const { activities: items } = this.rootGetters;
  return filter(items, { courseId: course.id });
});

getter(function activity() {
  const { activities } = this.rootGetters;
  return activities[this.state.activity] || {};
});

getter(function outlineActivities() {
  const activities = this.getters['course/activities'];
  const structure = this.getters['course/structure'];
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
});

getter(function isCollapsed() {
  const { outline } = this.state;
  return activity => activity && !outline.expanded[activity._cid];
});

getter(function revisions() {
  const course = this.getters['course/course'];
  if (!course) return [];
  const revs = this.rootGetters.revisions;
  return filter(revs, { courseId: course.id })
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
});

getter(function getConfig() {
  return element => {
    if (!element.type) return {};
    if (isTes(element)) {
      const course = this.rootGetters['course/course'];
      return getTesMeta(course.schema, element.type);
    }
    return getLevel(element.type) || {};
  };
});

getter(function getMetadata() {
  return element => {
    if (!element) return [];
    const config = this.rootGetters['course/getConfig'](element);
    if (!config.meta) return [];
    return map(config.meta, it => {
      const value = get(element, `${isTes(element) ? 'meta' : 'data'}.${it.key}`);
      return { ...it, value };
    });
  };
});

getter(function users() {
  return values(this.state.users);
});

getter(function currentUser() {
  const { user } = this.rootState.auth;
  return find(this.state.users, { id: user.id });
});

getter(function isCourseAdmin() {
  const user = this.getters['course/currentUser'];
  return get(user, 'courseRole') === role.course.ADMIN;
});

getter(function isCourseAuthor() {
  const user = this.getters['course/currentUser'];
  return get(user, 'courseRole') === role.course.AUTHOR;
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

mutation(function toggleActivities() {
  const { getters, state } = this;
  const outline = filter(getters['course/outlineActivities'], it => !it.deletedAt);
  const totalExpanded = compact(Object.values(state.outline.expanded)).length;
  const isOpen = totalExpanded < outline.length;
  const expanded = transform(outline, (acc, it) => (acc[it._cid] = isOpen), {});
  Vue.set(this.state.outline, 'expanded', expanded);
});

mutation(function toggleActivity({ _cid, expanded }) {
  let expandedItems = this.state.outline.expanded;
  expanded = expanded === undefined ? !expandedItems[_cid] : expanded;
  Vue.set(expandedItems, _cid, expanded);
});

mutation(function showActivityOptions(_cid) {
  this.state.outline.showOptions = _cid;
});

mutation(function focusActivity(_cid) {
  this.state.activity = _cid;
});

export default build();
