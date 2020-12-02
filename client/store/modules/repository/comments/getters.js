import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => (...entities) => {
  const { seen, items } = state;
  const [activity, element = null] = entities;
  const lastSeen =
    seen.contentElement[element?.uid] || seen.activity[activity.uid] || 0;
  const options = { activity, element, lastSeen, user: auth.user };
  return filter(items, it => inferUnseenConditions(it, options));
};

function inferUnseenConditions(it, { user, lastSeen, activity, element }) {
  const { authorId, activityId, contentElementId: elementId } = it;
  const hasElement = element ? elementId === element.id : elementId === null;
  const createdAt = new Date(it.createdAt).getTime();
  return hasElement &&
    activityId === activity.id &&
    authorId !== user.id &&
    createdAt > lastSeen;
}
