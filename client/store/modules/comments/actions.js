import generateActions from '../../helpers/actions';
import SSEClient from '../../../SSEClient';

const { api, get, save, setEndpoint, update } = generateActions('/comments');
let SSE_CLIENT;

const fetch = ({ state, commit }, { id, courseId }) => {
  const action = state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setCourse', courseId);
  return api.fetch({ activityId: id, courseId }).then(items => {
    commit(action, items);
    commit('commentsFetched', id);
  });
};

const subscribe = ({ state, commit }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
  SSE_CLIENT = new SSEClient(`/api/v1/comments/courses/${state.courseId}/subscribe`);
  SSE_CLIENT.subscribe('comment_create', item => commit('sseAdd', item));
  SSE_CLIENT.subscribe('comment_update', item => commit('sseUpdate', item));
  SSE_CLIENT.subscribe('comment_delete', item => commit('sseUpdate', item));
};

const unsubscribe = () => {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
};

const remove = (_, comment) => {
  // Update locally and let real data update be pushed from server
  // after soft delete
  comment.deletedAt = new Date();
  return api.remove(comment);
};

export {
  fetch,
  get,
  remove,
  save,
  subscribe,
  setEndpoint,
  unsubscribe,
  update
};
