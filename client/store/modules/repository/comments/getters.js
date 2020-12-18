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
    const isCurrentActivityComment = it.activityId === activity.id;
    const isAuthor = it.authorId === auth.user.id;
    const createdAt = new Date(it.createdAt).getTime();
    if (!isCurrentActivityComment || isAuthor || lastActivitySeen >= createdAt) return;
    if (!it.contentElement) return true;
    const lastElementSeen = get(seen.contentElement, it.contentElement.uid, 0);
    return lastElementSeen < createdAt;
  });
};
