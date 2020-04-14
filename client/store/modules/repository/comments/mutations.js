import { fetch, remove, reset, save, setEndpoint } from '@/store/helpers/mutations';
import find from 'lodash/find';
import findKey from 'lodash/findKey';
import pick from 'lodash/pick';
import Vue from 'vue';

const sseUpdate = (state, comment) => {
  const existing = find(state.items, { id: comment.id });
  if (!existing) return;
  const data = pick(comment, ['content', 'createdAt', 'updatedAt', 'deletedAt']);
  Vue.set(state.items, existing._cid, { ...existing, ...data });
};

const setSeenComment = (state, activityId) => {
  const key = findKey(state.items);
  const item = state.items[key];
  state.seenByActivity = {
    ...state.seenByActivity,
    [activityId]: new Date(item.createdAt).getTime()
  };
};

export {
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  sseUpdate,
  setSeenComment
};
