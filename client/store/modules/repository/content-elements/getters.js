import get from 'lodash/get';
import transform from 'lodash/transform';

export const elements = state => state.items;

export const processedElements = (_, { elements }, rootState, rootGetters) => {
  const { id: activityId } = rootGetters['editor/activity'];
  const getComments = rootGetters['repository/comments/getComments'];
  const { seen } = rootState.repository.comments;
  return transform(elements, (acc, it) => {
    const comments = getComments({ activityId, contentElementId: it.id });
    const lastCommentAt = new Date(get(comments[0], 'createdAt', 0)).getTime();
    acc[it.uid] = { ...it, comments, lastCommentAt, seen };
  }, {});
};
