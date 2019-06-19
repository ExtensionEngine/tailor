import { getLevel, getOutlineLevels, getTesMeta } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const COURSE_ROUTE = /\/course\/\d+/;
// NOTE: teaching elements always have `activityId` foreign key and that is
//       how we can tell if an element is `tes` or `activity`
const isTes = element => !!element.activityId;

export const course = (state, getters, rootState, rootGetters) => {
  const courseId = get(rootState, 'route.params.courseId');
  if (!courseId) return;
  if (!rootState.route.fullPath.match(COURSE_ROUTE)) return;
  return find(rootGetters.courses, { id: Number(courseId) });
};

export const structure = (state, getters) => {
  const course = getters.course;
  if (!course) return;
  return getOutlineLevels(course.schema);
};

export const activities = (state, getters, rootState, rootGetters) => {
  const course = getters.course;
  if (!course) return;
  const { activities: items } = rootGetters;
  return filter(items, { courseId: course.id });
};

export const activity = (state, getters, rootState, rootGetters) => {
  const { activities } = rootGetters;
  return activities[state.activity] || {};
};

export const outlineActivities = (state, getters) => {
  const activities = getters.activities;
  const structure = getters.structure;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const isCollapsed = state => {
  const { outline } = state;
  return activity => activity && !outline.expanded[activity._cid];
};

export const revisions = (state, getters, rootState, rootGetters) => {
  const course = getters.course;
  if (!course) return [];
  const revs = rootGetters.revisions;
  return filter(revs, { courseId: course.id })
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
};

export const getConfig = (state, getters, rootState, rootGetters) => {
  return element => {
    if (!element.type) return {};
    if (isTes(element)) {
      const course = rootGetters.course;
      return getTesMeta(course.schema, element.type);
    }
    return getLevel(element.type) || {};
  };
};

export const getMetadata = (state, getters, rootState, rootGetters) => {
  return element => {
    if (!element) return [];
    const config = getters.getConfig(element);
    if (!config.meta) return [];
    return map(config.meta, it => {
      const value = get(element, `${isTes(element) ? 'meta' : 'data'}.${it.key}`);
      return { ...it, value };
    });
  };
};

export const users = state => values(state.users);

export const currentUser = (state, getters, rootState) => {
  const { user } = rootState.auth;
  return find(state.users, { id: user.id });
};

export const isCourseAdmin = (state, getters) => {
  const user = getters.currentUser;
  return get(user, 'courseRole') === role.course.ADMIN;
};

export const isCourseAuthor = (state, getters) => {
  const user = getters.currentUser;
  return get(user, 'courseRole') === role.course.AUTHOR;
};
