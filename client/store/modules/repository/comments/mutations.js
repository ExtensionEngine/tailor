import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const markSeenComments = (state, { activityUid, lastCommentAt }) => {
  state.seenByActivity = {
    ...state.seenByActivity,
    [activityUid]: lastCommentAt
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
