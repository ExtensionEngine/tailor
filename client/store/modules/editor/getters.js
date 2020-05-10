import filter from 'lodash/filter';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import { getDescendants as getDeepChildren } from 'utils/activity';
import { getSupportedContainers } from 'shared/activities';
import reduce from 'lodash/reduce';

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
