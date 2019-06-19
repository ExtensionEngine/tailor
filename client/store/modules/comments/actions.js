import generateActions from '../../helpers/actions';
import SSEClient from '../../../SSEClient';
let SSE_CLIENT;

const { api, get, save, setBaseUrl } = generateActions();
api.pusi = 'kurac';

const fetch = ({ state, commit, rootState }, { activityId }) => {
  console.log({ api, baseUrl: api.baseUrl });
  const { courseId } = rootState.route.params;
  let action = state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setCourse', courseId);
  api.fetch({ activityId })
    .then(result => commit(action, result))
    .then(result => commit('commentsFetched', activityId));
};

const subscribe = ({ state, commit }) => {
  if (SSE_CLIENT) SSE_CLIENT.disconnect();
  SSE_CLIENT = new SSEClient(`/api/v1${state.$baseUrl}/subscribe`);
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
  return api.remove(comment);
};

function someShit() {
  setBaseUrl.apply(this, arguments);
  console.log({ api, baseUrl: api.baseUrl, args: [...arguments] });
}

export { fetch, get, remove, save, subscribe, unsubscribe, someShit as setBaseUrl };
