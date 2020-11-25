import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  if (!params.contentElementId) delete params.contentElementId;
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (activity, ce = null) => {
  const { seenBy, items } = state;
  const lastSeen = {
    ce: seenBy.contentElement[ce?.uid] || 0,
    activity: seenBy.activity[activity.uid] || 0
  };
  const options = { activity, ce, lastSeen, user: auth.user };
  return filter(items, it => setConditions(it, options));
};

function setConditions(it, { user, lastSeen, activity, ce }) {
  const { authorId, activityId, contentElementId, createdAt } = it;
  const hasCE = ce ? contentElementId === ce.id : true;
  return hasCE &&
    activityId === activity.id &&
    authorId !== user.id &&
    new Date(createdAt).getTime() > lastSeen.ce &&
    new Date(createdAt).getTime() > lastSeen.activity;
}
