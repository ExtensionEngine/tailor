import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';

export const getComments = state => params => {
  const comments = filter(state.items, params);
  return orderBy(comments, 'createdAt', 'desc');
};

export const getUnseenComments = (state, _, { auth }) => data => {
  const { id, name, content } = processData(data);
  const lastSeen = state.seenBy[name][content.uid] || 0;
  return filter(state.items, it =>
    it.authorId !== auth.user.id &&
    it[id] === content.id &&
    new Date(it.createdAt).getTime() > lastSeen);
};

function processData({ activity, contentElement }) {
  return activity
    ? { id: 'activityId', name: 'activity', content: activity }
    : { id: 'contentElementId', name: 'contentElement', content: contentElement };
}
