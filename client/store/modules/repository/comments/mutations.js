import { fetch, remove, reset, save, setEndpoint } from '@/store/helpers/mutations';
import find from 'lodash/find';
import pick from 'lodash/pick';
import Vue from 'vue';

const sseUpdate = (state, comment) => {
  const existing = find(state.items, { id: comment.id });
  if (!existing) return;
  const data = pick(comment, ['content', 'createdAt', 'updatedAt', 'deletedAt']);
  Vue.set(state.items, existing._cid, { ...existing, ...data });
};

export {
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  sseUpdate
};
