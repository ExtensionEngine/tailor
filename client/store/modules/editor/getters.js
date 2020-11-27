import filter from 'lodash/filter';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import { getDescendants as getDeepChildren } from 'utils/activity';
import { getSupportedContainers } from 'shared/activities';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniqBy from 'lodash/uniqBy';
import without from 'lodash/without';

export const activity = (_state, _getters, { route, repository }) => {
  const id = parseInt(get(route, 'params.activityId'), 10);
  return find(repository.activities.items, { id });
};

export const rootContainerGroups = (_state, getters, { repository }) => {
  const { items: activities } = repository.activities;
  const { activity } = getters;
  if (!activity) return {};
  const containers = getSupportedContainers(activity.type);
  return reduce(containers, (acc, { type }) => {
    acc[type] = filter(activities, { parentId: activity.id, type });
    return acc;
  }, {});
};

export const contentContainers = (_state, getters, { repository }) => {
  const { rootContainerGroups } = getters;
  const activities = repository.activities.items;
  const parents = flatMap(rootContainerGroups);
  return parents.reduce((acc, parent) => {
    acc.push(parent, ...getDeepChildren(activities, parent));
    return acc;
  }, []);
};

export const selectedElements = (_state, { activity }, rootState, rootGetters) => {
  if (!activity) return [];
  const {
    auth: { user },
    repository: { userTracking: { users: userTracking } }
  } = rootState;
  const entityState = rootGetters['repository/userTracking/activityByEntity'].activity;
  const activeUserIds = without(map(entityState[activity.id], 'id'), user.id);
  if (!activeUserIds.length) return [];
  const selections = Object.values(userTracking)
    .filter(it => activeUserIds.includes(it.id))
    .reduce((acc, { contexts = [], ...user }) => [
      ...acc,
      ...contexts.map(it => ({ ...user, ...it }))
    ], [])
    .filter(it => it.elementId && (it.activityId === activity.id));
  return uniqBy(selections, it => `${it.elementId}-${it.id}`);
};
