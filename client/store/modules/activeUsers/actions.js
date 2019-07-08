import api from '../../../api/activeUsers';
import generateActions from '../../helpers/actions';
import SSEClient from '../../../SSEClient';

let SSE_CLIENT;
const { setEndpoint } = generateActions();

const subscribe = ({ state, commit }, courseId) => {
  if (SSE_CLIENT) return;
  SSE_CLIENT = new SSEClient(`/api/v1${state.$apiUrl}/subscribe`);
  SSE_CLIENT.subscribe('active_user_add', ({ user, context }) => {
    commit('sseAdd', { user, context });
  });
  SSE_CLIENT.subscribe('active_user_remove', ({ user, context }) => {
    commit('sseRemove', { user, context });
  });
  SSE_CLIENT.subscribe('active_user_remove_session', ({ userId, sseId }) => {
    commit('sseRemoveSession', { userId, sseId });
  });
  SSE_CLIENT.subscribe('connection_initialized', ({ sseId }) => {
    commit('setSseId', { sseId });
  });
};

const unsubscribe = () => {
  if (!SSE_CLIENT) return;
  SSE_CLIENT.disconnect();
};

const fetch = ({ state, commit }, courseId) => {
  return api.fetch(courseId)
    .then(({ activeUsers }) => commit('save', activeUsers));
};

const add = (_, context) => {
  return api.add(context);
};

const remove = (_, context) => {
  return api.remove(context);
};

const removeSession = (_, context) => {
  return api.removeSession(context);
};

export {
  add,
  fetch,
  remove,
  removeSession,
  subscribe,
  setEndpoint,
  unsubscribe
};
