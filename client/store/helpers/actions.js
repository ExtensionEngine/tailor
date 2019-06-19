import cuid from 'cuid';
import Resource from './resource';

export default function ($baseUrl) {
  let api = new Resource($baseUrl);

  const get = ({ commit }, id) => {
    // TODO:  check if it needs replacing like boutique
    //        commit('save', res) || res)
    return api.getById(id).then(res => commit('save', res));
  };

  const fetch = ({ commit }, params = {}) => {
    return api.fetch(params).then(res => commit('fetch', res));
  };

  const reset = ({ commit }) => {
    return api.fetch().then(res => commit('reset', res));
  };

  const save = ({ commit, state }, model) => {
    if (!model._cid) model._cid = cuid();
    model._synced = false;
    model._version = Date.now();

    // create or update model locally
    commit('save', model);

    return api.save(model)
      .then(model => {
        // check if new change happened locally during api call
        // do not update meta if there is newer change
        const previous = state.items[model._cid];
        if (previous && previous._version === model._version) model._synced = true;
        commit('save', model);
      });
  };

  const remove = ({ commit }, model) => {
    // If added locally; not waiting for id (add)
    if (!model.id && !model._version) {
      commit('remove', [model]);
      return Promise.resolve(true);
    }

    return api.remove(model)
      .then(removed => commit('remove', removed));
  };

  const update = ({ commit }, model) => {
    const cid = model._cid;
    const changes = { ...model };
    delete changes._cid;
    return api.update(cid, changes)
      .then(updated => commit('update', updated));
  };

  const setBaseUrl = ({ state, commit }, baseUrl) => {
    if (state.$baseUrl !== baseUrl) {
      api = new Resource(baseUrl);
      commit('setBaseUrl', baseUrl);
    }
    console.log('base setBaseUrl', { api, baseUrl: api.baseUrl, args: [...arguments] });
  };

  return {
    api,
    get,
    fetch,
    reset,
    save,
    remove,
    update,
    setBaseUrl
  };
}
