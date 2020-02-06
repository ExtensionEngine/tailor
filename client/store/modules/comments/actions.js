import generateActions from '../../helpers/actions';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import SSEClient from '../../../SSEClient';

const { api, get, save, setEndpoint, update } = generateActions();
let SSE_CLIENT;

const filterExistingComment = (existingComments, fetchedComments) => {
  const existingId = map(existingComments, 'id');
  return pickBy(fetchedComments, it => !existingId.includes(it.id));
};

const fetch = ({ state, commit }, { id, repositoryId }) => {
  const action = state.repositoryId === repositoryId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setRepository', repositoryId);
  return api.fetch({ activityId: id }).then(items => {
    commit(action, filterExistingComment(state.items, items));
    commit('commentsFetched', id);
  });
};

const subscribe = ({ state, commit }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();

  SSE_CLIENT = new SSEClient(`/api/v1${state.$apiUrl}/subscribe`);
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
