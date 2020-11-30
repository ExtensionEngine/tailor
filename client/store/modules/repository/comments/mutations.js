import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const markSeenComments = (state, { activityUid, ceUid, lastCommentAt }) => {
  const key = ceUid ? 'contentElement' : 'activity';
  state.seen[key] = {
    ...state.seen[key],
    [ceUid || activityUid]: lastCommentAt
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
