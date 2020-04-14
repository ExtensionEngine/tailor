import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getActivityComments = state => activityId => {
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};

export const getUnseenComments = state => (comments, activityId) => {
  const lastSeen = state.seenByActivity[activityId] || 0;
  return filter(comments, it =>
    new Date(it.createdAt).getTime() > new Date(lastSeen).getTime());
};
