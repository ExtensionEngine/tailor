import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (...entities) => {
  const { seen, items } = state;
  const [activity, contentElement = null] = entities;
  const lastSeen = {
    ce: seen.contentElement[contentElement?.uid] || 0,
    activity: seen.activity[activity.uid] || 0
  };
  const options = { activity, contentElement, lastSeen, user: auth.user };
  return filter(items, it => setConditions(it, options));
};

function setConditions(it, { user, lastSeen, activity, contentElement }) {
  const { authorId, activityId, contentElementId } = it;
  const hasCE = contentElement ? contentElementId === contentElement.id : true;
  const createdAt = new Date(it.createdAt).getTime();
  return hasCE &&
    activityId === activity.id &&
    authorId !== user.id &&
    createdAt > lastSeen.ce &&
    createdAt > lastSeen.activity;
}
