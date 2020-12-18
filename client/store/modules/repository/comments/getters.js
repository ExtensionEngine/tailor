import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = (state, _, { auth }) => activity => {
  const { items, seen } = state;
  const lastActivitySeen = get(seen.activity, activity.uid, 0);
  return filter(items, it => {
    const createdAt = new Date(it.createdAt).getTime();
    const isAuthor = it.authorId === auth.user.id;
    if (it.activityId !== activity.id || isAuthor || lastActivitySeen > createdAt) return;
    if (!it.contentElement) return true;
    const lastElementSeen = get(seen.contentElement, it.contentElement.uid, 0);
    return lastElementSeen < createdAt;
  });
};
