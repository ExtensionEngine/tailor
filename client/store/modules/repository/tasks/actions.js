import generateActions from '@/store/helpers/actions';

const { api, fetch, reset, save, setEndpoint, update, remove } = generateActions();

const create = ({ commit, dispatch }, data) => {
  return api.save(data)
    .then(model => {
      commit('add', model);
      dispatch('repository/activities/reset', null, { root: true });
      return model;
    });
};

const archive = ({ commit }, model) => {
  if (!model.id) return commit('archive', model);
  return api.patch(`${model.id}/archive`)
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
