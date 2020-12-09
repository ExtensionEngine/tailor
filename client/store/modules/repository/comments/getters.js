import filter from 'lodash/filter';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import transform from 'lodash/transform';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenActivityComments = (state, _, { auth }) => activity => {
  const { items, seen } = state;
  const lastSeen = seen.activity[activity.uid] || 0;
  const comments = processUnseenComments(items, seen);
  return filter(comments, it =>
    it.activityId === activity.id &&
    it.authorId !== auth.user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
};

function processUnseenComments(items, seen) {
  if (!seen.allElementComments.length) return items;
  return transform(items, (acc, comment, key) => {
    const found = find(seen.allElementComments, { id: comment.id });
    if (!found) return (acc[key] = comment);
  }, {});
}
