import generateActions from '@/store/helpers/actions';
import SSEClient from '@/SSEClient';

const { api, get, save, setEndpoint, update } = generateActions();
const feed = new SSEClient();

const Event = {
  Create: 'comment:create',
  Update: 'comment:update',
  Delete: 'comment:delete'
};

const fetch = ({ state, commit }, { id, courseId }) => {
  const action = state.courseId === courseId ? 'fetch' : 'reset';
  if (action === 'reset') commit('setCourse', courseId);
  return api.fetch({ activityId: id }).then(items => {
    commit(action, items);
    commit('commentsFetched', id);
  });
};

const subscribe = ({ rootState, commit }) => {
  const { courseId } = rootState.route.params;
  const token = localStorage.getItem('JWT_TOKEN');
  const params = { courseId, token };
  feed
    .connect(api.getUrl('/subscribe'), { params })
    .subscribe(Event.Create, item => api.setCid(item) || commit('sseAdd', item))
    .subscribe(Event.Update, item => commit('sseUpdate', item))
    .subscribe(Event.Delete, item => commit('sseUpdate', item));
};

const unsubscribe = () => feed.disconnect();

const remove = ({ commit }, comment) => {
  // Update locally and let real data update be pushed from server
  // after soft delete
  comment.deletedAt = new Date();
  commit('update', comment);
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
