import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getActivityComments = state => activityId => {
  const activityComments = filter(state.items, { activityId });
  return orderBy(activityComments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, rootState) => activity => {
  const { items, seenByActivity } = state;
  const { user } = rootState.auth;
  const lastSeen = seenByActivity[activity.uid] || 0;
  return filter(items, it =>
    it.authorId !== user.id &&
    it.activityId === activity.id &&
    new Date(it.createdAt).getTime() > new Date(lastSeen));
};
