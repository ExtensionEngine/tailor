import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, rootState) => activity => {
  const { items, seenBy } = state;
  const { user } = rootState.auth;
  const lastSeen = seenBy.activity[activity.uid] || 0;
  return filter(items, it =>
    it.authorId !== user.id &&
    it.activityId === activity.id &&
    new Date(it.createdAt).getTime() > lastSeen);
};

export const getUnseenCeComments = (state, _, rootState) => contentElement => {
  const { items, seenBy } = state;
  const { user } = rootState.auth;
  const lastSeen = seenBy.contentElement[contentElement.uid] || 0;
  return filter(items, it =>
    it.authorId !== user.id &&
    it.contentElementId === contentElement.id &&
    new Date(it.createdAt).getTime() > lastSeen);
};
