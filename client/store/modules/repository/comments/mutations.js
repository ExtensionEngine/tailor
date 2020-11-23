import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const markSeenComments = (state, { activityUid, elementUid, lastCommentAt }) => {
  const key = elementUid ? 'contentElement' : 'activity';
  state.seenBy[key] = {
    ...state.seenBy[key],
    [elementUid || activityUid]: lastCommentAt
  };
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
