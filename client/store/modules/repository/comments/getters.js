import filter from 'lodash/filter';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  if (params.contentElementId) params.resolvedAt = null;
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = ({ seen }, getters, { auth }) => activity => {
  const activityComments = getters.getComments({ activityId: activity.id });
  const activitySeenAt = get(seen.activity, activity.uid, 0);
  return filter(activityComments, it => {
    const isAuthor = it.author.id === auth.user.id;
    const createdAt = new Date(it.createdAt).getTime();
    if (isAuthor || activitySeenAt >= createdAt) return;
    if (!it.contentElement) return true;
    // Return unseen activity comment if contentElement is not set
    const elementSeenAt = get(seen.contentElement, it.contentElement.uid, 0);
    return elementSeenAt < createdAt;
  });
};
