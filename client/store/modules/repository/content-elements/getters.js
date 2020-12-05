import get from 'lodash/get';
import transform from 'lodash/transform';

export const elements = state => state.items;

export const processedElements = (_, { elements }, __, rootGetters) => {
  const { getUnseenComments, getComments } = resolveCommentGetters(rootGetters);
  const { id: activityId, uid: activityUid } = rootGetters['editor/activity'];
  return transform(elements, (acc, it) => {
    const element = { ...it, activityUid, activityId };
    const comments = getComments({ activityId, contentElementId: it.id });
    const lastCommentAt = new Date(get(comments[0], 'createdAt', 0)).getTime();
    const unseenComments = getUnseenComments(element);
    acc[it.uid] = { ...it, comments, lastCommentAt, unseenComments };
  }, {});
};

const resolveCommentGetters = getters => ({
  getUnseenComments: getters['repository/comments/getUnseenElementComments'],
  getComments: getters['repository/comments/getComments']
});
