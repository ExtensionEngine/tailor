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
  const { activityUid, elementUid, lastCommentAt, unseenElementComments = [] } = payload;
  const key = elementUid ? 'contentElement' : 'activity';
  state.seen[key] = {
    ...state.seen[key],
    [elementUid || activityUid]: lastCommentAt
  };
  if (!elementUid && !unseenElementComments.length) return;
  state.seenElementComments = [
    ...state.seenElementComments,
    ...unseenElementComments
  ];
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
