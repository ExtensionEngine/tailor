import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const markSeenComments = ({ seen }, payload) => {
  const { activityUid, elementUid, lastCommentAt, unseenElementComments } = payload;
  const key = elementUid ? 'contentElement' : 'activity';
  seen[key] = {
    ...seen[key],
    [elementUid || activityUid]: lastCommentAt
  };
  if (activityUid) return (seen.allElementComments = []);
  if (!unseenElementComments) return;
  seen.allElementComments = [...seen.allElementComments, ...unseenElementComments];
};

export {
  add,
  fetch,
  markSeenComments,
  remove,
  reset,
  save,
  setEndpoint,
  update
};
