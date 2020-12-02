import { Task as Events } from '@/../common/sse';
import feed from '../feed';
import generateActions from '@/store/helpers/actions';

const { api, fetch, reset, save, setEndpoint, update, remove } = generateActions();

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('save', item))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

const archive = ({ commit }, model) => {
  if (!model.id) return commit('remove', [model]);
  return api.post(`${model.id}/archive`)
    .then(() => commit('remove', [model]));
};

export {
  fetch,
  plugSSE,
  remove,
  reset,
  save,
  setEndpoint,
  update,
  archive
};
