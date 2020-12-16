import { Comment as Events } from '@/../common/sse';
import feed from '../feed';
import generateActions from '@/store/helpers/actions';

const { api, get, save, setEndpoint, update } = generateActions();

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('update', item))
    .subscribe(Events.Delete, item => commit('update', item));
};

const fetch = ({ commit }, payload) => {
  return api.fetch(payload)
    .then(items => commit('fetch', items));
};

const resolve = async ({ commit }, contentElementId) => {
  await api.post('/resolve', { contentElementId });
  const data = { elementId: contentElementId, resolved: true };
  commit('handleResolvement', data);
};

const remove = ({ commit }, comment) => {
  comment.deletedAt = new Date();
  commit('save', comment);
  return api.remove(comment);
};

export {
  fetch,
  get,
  plugSSE,
  remove,
  save,
  setEndpoint,
  update,
  resolve
};
