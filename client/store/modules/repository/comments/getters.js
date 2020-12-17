import filter from 'lodash/filter';
import max from 'lodash/max';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = (state, _, { auth }) => activity => {
  const { items, seen } = state;
  const lastElementSeen = max(Object.values(seen.contentElement));
  const lastSeen = max([seen.activity[activity.uid], lastElementSeen]) || 0;
  return filter(items, it =>
    it.activityId === activity.id &&
    it.authorId !== auth.user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
};
