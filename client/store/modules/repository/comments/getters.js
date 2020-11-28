import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import transform from 'lodash/transform';

export const getComments = state => params => {
  if (!params.contentElementId) delete params.contentElementId;
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (...entities) => {
  const [activity, ce = null] = entities;
  const lastSeen = {
    ce: state.seen.contentElement[ce?.uid] || 0,
    activity: state.seen.activity[activity.uid] || 0
  };
  const items = processUnseenComments(state, ce);
  const options = { activity, ce, lastSeen, user: auth.user };
  return filter(items, it => setConditions(it, options));
};

function processUnseenComments({ items, seenCEComments }, ce) {
  if (ce || !seenCEComments.length) return items;
  return transform(items, (acc, comment, key) => {
    const found = seenCEComments.find(it => it.id === comment.id);
    if (!found) return (acc[key] = comment);
  }, {});
}

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
