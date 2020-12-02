import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = (state, _, { auth }) => activity => {
  const { seen, items } = state;
  const lastSeen = seen.activity[activity.uid] || 0;
  return filter(items, it =>
    it.contentElementId === null &&
    it.activityId === activity.id &&
    it.authorId !== auth.user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
};

export const getUnseenElementComments = (state, _, { auth }) => element => {
  const { seen, items } = state;
  const lastSeen = seen.contentElement[element.uid] || 0;
  return filter(items, it =>
    it.contentElementId === element.id &&
    it.authorId !== auth.user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
};
