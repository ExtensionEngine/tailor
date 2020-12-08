import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import transform from 'lodash/transform';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = (state, _, { auth }) => activity => {
  const lastSeen = state.seen.activity[activity.uid] || 0;
  const comments = processUnseenComments(state);
  return filter(comments, it =>
    it.activityId === activity.id &&
    it.authorId !== auth.user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
};

function processUnseenComments({ items, seenElementComments }) {
  if (!seenElementComments.length) return items;
  return transform(items, (acc, comment, key) => {
    const found = seenElementComments.find(it => it.id === comment.id);
    if (!found) return (acc[key] = comment);
  }, {});
}
