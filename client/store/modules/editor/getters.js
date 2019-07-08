import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getSupportedContainers } from 'shared/activities';
import reduce from 'lodash/reduce';

export const activity = (_state, _getters, rootState, rootGetters) => {
  const id = parseInt(get(rootState, 'route.params.activityId'), 10);
  return find(rootGetters.activities, { id });
};

export const contentContainers = (_state, getters, _rootState, rootGetters) => {
  const { activities } = rootGetters;
  const { activity } = getters;
  if (!activity) return {};
  const containers = getSupportedContainers(activity.type);
  return reduce(containers, (acc, { type }) => {
    acc[type] = filter(activities, { parentId: activity.id, type });
    return acc;
  }, {});
};

export const assessments = (_state, getters, _rootState, rootGetters) => {
  const { tes } = rootGetters;
  const { activity } = getters;
  if (!activity) return [];
  return filter(tes, { activityId: activity.id, type: 'ASSESSMENT' });
};
