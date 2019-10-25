import generateActions from '../../helpers/actions';
import SSEClient from '../../../SSEClient';

const { api, get, save, setEndpoint, update } = generateActions();
let SSE_CLIENT;

const fetch = ({ state, commit }, { id, courseId }) => {
  const action = state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setCourse', courseId);
  return api.fetch({ activityId: id }).then(items => {
    commit(action, items);
    commit('commentsFetched', id);
  });
};

const subscribe = ({ state, commit, rootGetters }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();

  // Get token from the Auth module
  const token = rootGetters.token;
  SSE_CLIENT = new SSEClient(`/api/v1/${state.$apiUrl}/subscribe`, token);
  SSE_CLIENT.subscribe('comment_create', item => commit('sseAdd', item));
  SSE_CLIENT.subscribe('comment_update', item => commit('sseUpdate', item));
  SSE_CLIENT.subscribe('comment_delete', item => commit('sseUpdate', item));
};

const unsubscribe = () => {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
};

const remove = ({ state, commit }, comment) => {
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
