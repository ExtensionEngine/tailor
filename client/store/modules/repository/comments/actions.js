import generateActions from '../../../helpers/actions';
import SSEClient from '../../../../SSEClient';

const { api, get, save, setEndpoint, update } = generateActions();
let SSE_CLIENT;

const fetch = ({ commit, rootGetters }, { id, repositoryId }) => {
  const action = rootGetters['repository/id'] === repositoryId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setRepository', repositoryId);
  return api.fetch({ activityId: id }).then(items => {
    commit(action, items);
    commit('commentsFetched', id);
  });
};

const subscribe = ({ state, commit }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
  SSE_CLIENT = new SSEClient(`/api/v1/${state.$apiUrl}/subscribe`);
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
