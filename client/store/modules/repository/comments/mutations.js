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
  state.seenByActivity = {
    ...state.seenByActivity,
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
