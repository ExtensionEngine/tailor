import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getContentContainers } from 'utils/activity';
import groupBy from 'lodash/groupBy';

export const activity = (_state, _getters, { route, repository }) => {
  const id = parseInt(get(route, 'params.activityId'), 10);
  return find(repository.activities.items, { id });
};

export const contentContainers = (_state, getters, { repository }) => {
  const { items: activities } = repository.activities;
  const { activity } = getters;
  if (!activity) return {};
  return groupBy(getContentContainers(activities, activity), 'type');
};

export const assessments = (_state, getters, rootState) => {
  const { items: tes } = rootState.repository.tes;
  const { activity } = getters;
  if (!activity) return [];
  return filter(tes, { activityId: activity.id, type: 'ASSESSMENT' });
};
