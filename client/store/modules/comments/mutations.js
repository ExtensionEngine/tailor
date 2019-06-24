import {
  add,
  fetch,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/mutations';
import cuid from 'cuid';
import find from 'lodash/find';
import pick from 'lodash/pick';
import Vue from 'vue';

const setCourse = (state, courseId) => {
  state.courseId = courseId;
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
  const updated = Object.assign({}, existing, data);
  Vue.set(state.items, updated._cid, updated);
};

export {
  fetch,
  reset,
  add,
  save,
  remove,
  update,
  setBaseUrl,
  setCourse,
  commentsFetched,
  sseAdd,
  sseUpdate
};
