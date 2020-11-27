import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (activity, ce = null) => {
  const { seen, items } = state;
  const lastSeen = seen.contentElement[ce?.uid] || seen.activity[activity.uid] || 0;
  const options = { activity, ce, lastSeen, user: auth.user };
  return filter(items, it => setConditions(it, options));
};

function setConditions(it, { user, lastSeen, activity, ce }) {
  const { authorId, activityId, contentElementId } = it;
  const hasCE = ce ? contentElementId === ce.id : contentElementId === null;
  const createdAt = new Date(it.createdAt).getTime();
  return hasCE &&
    activityId === activity.id &&
    authorId !== user.id &&
    createdAt > lastSeen;
}
