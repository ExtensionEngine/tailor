import { get, save, setBaseUrl } from '../../helpers/actions';
import SSEClient from '../../../SSEClient';
let SSE_CLIENT;

const fetch = ({ state, commit, rootState }, { activityId }) => {
  const { courseId } = rootState.route.params;
  let action = state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setCourse', courseId);
  state.api.fetch({ activityId })
    .then(result => commit(action, result))
    .then(() => commit('commentsFetched', activityId));
};

const subscribe = ({ state, commit }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
  SSE_CLIENT = new SSEClient(`/api/v1${state.api.baseUrl}/subscribe`);
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
  commit('update', comment);
  return state.api.remove(comment);
};

export { fetch, get, remove, save, subscribe, unsubscribe, setBaseUrl };
