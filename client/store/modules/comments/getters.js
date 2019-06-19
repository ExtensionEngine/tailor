import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const comments = (state, getters, rootState, rootGetters) => {
  const activityId = rootGetters['course/activity'].id;
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};

export const commentsCount = (state, getters, rootState, rootGetters) => {
  return Object.keys(rootGetters.comments).length;
};

export const commentsFetched = (state, getters, rootState, rootGetters) => {
  const activityId = rootGetters['course/activity'].id;
  return !!state.activitiesFetched[activityId];
};
