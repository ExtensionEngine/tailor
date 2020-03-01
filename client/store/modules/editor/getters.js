import filter from 'lodash/filter';
import find from 'lodash/find';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
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
  const { items: activities } = repository.activities;
  const parents = flatMap(rootContainerGroups);
  const children = findChildren(activities, parents);
  return [...parents, ...children];
};

export const assessments = (_state, getters, rootState) => {
  const { items: tes } = rootState.repository.tes;
  const { activity } = getters;
  if (!activity) return [];
  return filter(tes, { activityId: activity.id, type: 'ASSESSMENT' });
};

function findChildren(activities, parents) {
  const children = filter(activities, it => find(parents, { id: it.parentId }));
  if (children.length) children.push(...findChildren(activities, children));
  return children;
}
