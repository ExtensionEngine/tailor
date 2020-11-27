import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  if (!params.contentElementId) delete params.contentElementId;
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (activity, ce = null) => {
  const { seen, items } = state;
  const lastSeen = {
    ce: seen.contentElement[ce?.uid] || 0,
    activity: seen.activity[activity.uid] || 0
  };
  const options = { activity, ce, lastSeen, user: auth.user };
  return filter(items, it => setConditions(it, options));
};

function setConditions(it, { user, lastSeen, activity, ce }) {
  const { authorId, activityId, contentElementId } = it;
  const hasCE = ce ? contentElementId === ce.id : true;
  const createdAt = new Date(it.createdAt).getTime();
  return hasCE &&
    activityId === activity.id &&
    authorId !== user.id &&
    createdAt > lastSeen.ce &&
    createdAt > lastSeen.activity;
}
