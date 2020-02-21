import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSupportedContainers } from 'shared/activities';
import reduce from 'lodash/reduce';

export const activity = (_state, _getters, { route, repository }) => {
  const id = parseInt(get(route, 'params.activityId'), 10);
  return find(repository.activities.items, { id });
};

export const contentContainers = (_state, getters, { repository }) => {
  const { items: activities } = repository.activities;
  const { activity } = getters;
  if (!activity) return {};
  const containers = getSupportedContainers(activity.type);
  return reduce(containers, (acc, { type }) => {
    acc[type] = filter(activities, { parentId: activity.id, type });
    return acc;
  }, {});
};

export const assessments = (_state, getters, rootState) => {
  const { items: tes } = rootState.repository.tes;
  const { activity } = getters;
  if (!activity) return [];
  return filter(tes, { activityId: activity.id, type: 'ASSESSMENT' });
};
