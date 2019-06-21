import cuid from 'cuid';

export const get = ({ state, commit }, id) => {
  // TODO:  check if it needs replacing like boutique
  //        commit('save', res) || res)
  return state.api.getById(id).then(res => commit('save', res));
};

export const fetch = ({ state, commit }, params = {}) => {
  return state.api.fetch(params).then(res => commit('fetch', res));
};

export const reset = ({ state, commit }) => {
  return state.api.fetch().then(res => commit('reset', res));
};

export const save = ({ commit, state }, model) => {
  if (!model._cid) model._cid = cuid();
  model._synced = false;
  model._version = Date.now();

  // create or update model locally
  commit('save', model);

  return state.api.save(model)
    .then(model => {
      // check if new change happened locally during api call
      // do not update meta if there is newer change
      const previous = state.items[model._cid];
      if (previous && previous._version === model._version) model._synced = true;
      commit('save', model);
    });
};

export const remove = ({ state, commit }, model) => {
  // If added locally; not waiting for id (add)
  if (!model.id && !model._version) {
    commit('remove', [model]);
    return Promise.resolve(true);
  }

  return state.api.remove(model)
    .then(removed => commit('remove', removed));
};

export const update = ({ state, commit }, model) => {
  const cid = model._cid;
  const changes = { ...model };
  delete changes._cid;
  return state.api.update(cid, changes)
    .then(updated => commit('update', updated));
};

export const setBaseUrl = ({ state, commit }, baseUrl) => {
  if (state.api.baseUrl !== baseUrl) {
    commit('setBaseUrl', baseUrl);
  }
};
