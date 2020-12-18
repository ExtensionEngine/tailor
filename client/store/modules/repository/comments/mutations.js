import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';
import transform from 'lodash/transform';

const markSeenComments = ({ seen }, payload) => {
  const { activityUid, elementUid, lastCommentAt } = payload;
  const key = elementUid ? 'contentElement' : 'activity';
  seen[key] = {
    ...seen[key],
    [elementUid || activityUid]: lastCommentAt
  };
};

const handleResolvement = (state, data) => {
  const { elementId, resolved = false } = data;
  state.items = transform(state.items, (acc, comment, key) => {
    const found = comment.contentElementId === elementId;
    acc[key] = found ? { ...comment, resolved } : comment;
  });
};

export {
  add,
  fetch,
  markSeenComments,
  remove,
  reset,
  save,
  setEndpoint,
  update,
  handleResolvement
};
