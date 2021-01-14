import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = ({ seen }, getters, { auth }) => activity => {
  const activityComments = getters.getComments({ activityId: activity.id });
  const lastActivitySeenDate = get(seen.activity, activity.uid, 0);
  return filter(activityComments, it => {
    const isAuthor = it.authorId === auth.user.id;
    const createdAt = new Date(it.createdAt).getTime();
    if (isAuthor || lastActivitySeenDate >= createdAt) return;
    if (!it.contentElement) return true; // Early return activity comment.
    const lastElementSeenDate = get(seen.contentElement, it.contentElement.uid, 0);
    return lastElementSeenDate < createdAt;
  });
};
