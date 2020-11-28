import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const markSeenComments = (state, payload) => {
  const { activityUid, ceUid, lastCommentAt, unseenCEComments = [] } = payload;
  const key = ceUid ? 'contentElement' : 'activity';
  state.seen[key] = {
    ...state.seen[key],
    [ceUid || activityUid]: lastCommentAt
  };
  if (!ceUid && !unseenCEComments.length) return;
  state.seenCEComments = [...state.seenCEComments, ...unseenCEComments];
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
