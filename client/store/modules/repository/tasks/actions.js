import { Task as Events } from '@/../common/sse';
import { feed } from '../feed';
import generateActions from '@/store/helpers/actions';
import uuid from '@/utils/uuid';

const { api, fetch, reset, save, setEndpoint, update, remove } = generateActions();

const plugSSE = ({ commit }) => {
  feed
    .subscribe(Events.Create, item => commit('save', item))
    .subscribe(Events.Update, item => commit('save', item))
    .subscribe(Events.Delete, item => commit('remove', [item]));
};

const create = ({ commit, dispatch }, data) => {
  const model = { ...data, uid: uuid() };
  return api.save(model)
    .then(model => {
      commit('add', model);
      dispatch('repository/activities/get', data.activityId, { root: true });
      return model;
    });
};

const archive = ({ commit }, model) => {
  if (!model.id) return commit('archive', model);
  return api.post(`${model.id}/archive`)
    .then(() => commit('archive', model));
};

export {
  create,
  fetch,
  plugSSE,
  remove,
  reset,
  save,
  setEndpoint,
  update,
  archive
};
