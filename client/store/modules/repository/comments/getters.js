import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => data => {
  const { seenBy, items } = state;
  const { fk, entityName, item } = adjustData(data);
  const lastSeen = seenBy[entityName][item.uid] || 0;
  return filter(items, it =>
    it.authorId !== auth.user.id &&
    it[fk] === item.id &&
    new Date(it.createdAt).getTime() > lastSeen);
};

function adjustData({ activity, contentElement }) {
  return activity
    ? { fk: 'activityId', entityName: 'activity', item: activity }
    : { fk: 'contentElementId', entityName: 'contentElement', item: contentElement };
}
