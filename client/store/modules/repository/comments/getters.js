import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = ({ seen, items }, _, { auth }) => entity => {
  const options = { seen, items, user: auth.user };
  return entity.activityId
    ? getUnseenElementComments(entity, options)
    : getUnseenActivityComments(entity, options);
};

function getUnseenActivityComments(activity, { seen, items, user }) {
  const lastSeen = seen.activity[activity.uid] || 0;
  return filter(items, it =>
    it.contentElementId === null &&
    it.activityId === activity.id &&
    it.authorId !== user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
}

function getUnseenElementComments(element, { seen, items, user }) {
  const lastSeen = seen.contentElement[element.uid] || 0;
  return filter(items, it =>
    it.contentElementId === element.id &&
    it.authorId !== user.id &&
    new Date(it.createdAt).getTime() > lastSeen
  );
}
