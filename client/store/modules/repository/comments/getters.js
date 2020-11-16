import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => ({ activityId, contentElementId }) => {
  const params = contentElementId ? { activityId, contentElementId } : { activityId };
  const comments = filter(state.items, { ...params });
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, rootState) => activity => {
  const { items, seenByActivity } = state;
  const { user } = rootState.auth;
  const lastSeen = seenByActivity[activity.uid] || 0;
  return filter(items, it =>
    it.authorId !== user.id &&
    it.activityId === activity.id &&
    new Date(it.createdAt).getTime() > lastSeen);
};
