import cuid from 'cuid';
import generateActions from '@/store/helpers/actions';

const { api, fetch, reset, save, setEndpoint, update, remove } = generateActions();

const create = ({ commit, dispatch }, data) => {
  const model = { ...data, _cid: cuid() };
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
    .then(() => { commit('archive', model); });
};

export {
  create,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update,
  archive
};
