import { getLevel, getOutlineLevels, getSchema, getTesMeta } from 'shared/activities';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { role } from 'shared';
import values from 'lodash/values';

const isTes = element => !!element.activityId;

export const course = (_state, _getters, { route }, { courses }) => {
  const courseId = get(route, 'params.courseId');
  if (!courseId) return;
  return find(courses, { id: parseInt(courseId, 10) });
};

export const schema = (_state, getters) => {
  return getters.course ? getSchema(getters.course.schema).name : '';
};

export const structure = (_, { course }) => {
  if (!course) return;
  return getOutlineLevels(course.schema);
};

export const activities = (_state, { course }, _rootState, rootGetters) => {
  if (!course) return;
  const { activities: items } = rootGetters;
  return filter(items, { courseId: course.id });
};

export const activity = (state, _getters, _rootState, { activities }) => {
  return activities[state.activity] || {};
};

export const outlineActivities = (_, getters) => {
  const { activities, structure } = getters;
  const outlineTypes = map(structure, 'type');
  return filter(activities, it => outlineTypes.includes(it.type));
};

export const isCollapsed = state => {
  return activity => activity && !state.outline.expanded[activity._cid];
};

export const revisions = (_state, { course }, _rootState, rootGetters) => {
  if (!course) return [];
  return filter(rootGetters.revisions, { courseId: course.id })
    .map(rev => ({ ...rev, createdAt: new Date(rev.createdAt) }))
    .sort((rev1, rev2) => rev2.createdAt - rev1.createdAt);
};

export const getConfig = (_, { course }) => {
  return element => {
    if (!element.type) return {};
    if (isTes(element)) return getTesMeta(course.schema, element.type);
    return getLevel(element.type) || {};
  };
};

export const getMetadata = (_, { getConfig }) => {
  return element => {
    if (!element) return [];
    const config = getConfig(element);
    if (!config.meta) return [];
    return map(config.meta, it => {
      const value = get(element, `${isTes(element) ? 'meta' : 'data'}.${it.key}`);
      return { ...it, value };
    });
  };
};

export const users = state => values(state.users);

export const isCourseAdmin = (state, _, rootState) => {
  const { user } = rootState.auth;
  if (!user) return;
  const courseUser = find(state.users, { id: user.id });
  return get(courseUser, 'courseRole') === role.course.ADMIN;
};
