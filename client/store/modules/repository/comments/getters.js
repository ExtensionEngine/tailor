import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getActivityComments = state => activityId => {
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};

export const getUnseenComments = state => (comments, activityUid) => {
  const lastSeen = state.seenByActivity[activityUid] || 0;
  return filter(comments, it =>
    new Date(it.createdAt).getTime() > new Date(lastSeen).getTime());
};
