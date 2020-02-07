import { fetch, remove, reset, save, setEndpoint } from '../../../helpers/mutations';
import cuid from 'cuid';
import find from 'lodash/find';
import pick from 'lodash/pick';
import Vue from 'vue';

const setRepository = (state, repositoryId) => {
  state.repositoryId = repositoryId;
  state.activitiesFetched = {};
};

const commentsFetched = (state, activityId) => {
  Vue.set(state.activitiesFetched, activityId, true);
};

const sseAdd = (state, comment) => {
  const { id } = comment;
  if (find(state.items, { id })) return;
  comment._cid = cuid();
  Vue.set(state.items, comment._cid, comment);
};

const sseUpdate = (state, comment) => {
  const existing = find(state.items, { id: comment.id });
  if (!existing) return;
  const data = pick(comment, ['content', 'createdAt', 'updatedAt', 'deletedAt']);
  Vue.set(state.items, existing._cid, { ...existing, ...data });
};

export {
  commentsFetched,
  fetch,
  remove,
  reset,
  save,
  setRepository,
  setEndpoint,
  sseAdd,
  sseUpdate
};
