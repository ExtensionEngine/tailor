import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

// TODO: Remove from store if not reused
export const comments = (state, _getters, _rootState, rootGetters) => {
  const activityId = rootGetters['course/activity'].id;
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};

export const commentsCount = (_state, getters) => {
  return Object.keys(getters.comments).length;
};

export const commentsFetched = (state, _getters, _rootState, rootGetters) => {
  const activityId = rootGetters['course/activity'].id;
  return !!state.activitiesFetched[activityId];
};
