import generateActions from '@/store/helpers/actions';

const { api, fetch, reset, save, setEndpoint, update, remove } = generateActions();

const archive = ({ commit }, model) => {
  if (!model.id) return commit('archive', model);
  return api.patch(`${model.id}/archive`).then(() => {
    commit('archive', model);
  });
};

export {
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update,
  archive
};
