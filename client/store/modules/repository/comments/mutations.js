import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';
import map from 'lodash/map';

const markSeenComments = ({ seen }, payload) => {
  const { activityUid, elementUid, lastCommentAt, unseenElementComments } = payload;
  const key = elementUid ? 'contentElement' : 'activity';
  seen[key] = {
    ...seen[key],
    [elementUid || activityUid]: lastCommentAt
  };
  if (activityUid) return (seen.elementComments = []);
  if (!unseenElementComments) return;
  seen.elementComments = [...seen.elementComments, ...unseenElementComments];
};

const resolveComments = (state, commentIds) => {
  state.items = map(state.items, comment => {
    const found = commentIds.find(id => id === comment.id);
    return found ? { ...comment, resolved: true } : comment;
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
  resolveComments
};
