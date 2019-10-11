import cuid from 'cuid';
import Resource from './resource';

export default function ($apiUrl) {
  const api = new Resource($apiUrl);

  const get = ({ commit }, id) => {
    return api.getById(id).then(item => commit('save', item) || item);
  };

  const fetch = ({ commit }, opts = {}) => {
    return api.fetch(opts).then(res => commit('fetch', res));
  };

  const reset = ({ commit }, opts = {}) => {
    return api.fetch(opts).then(res => commit('reset', res));
  };

  const filter = ({ commit }, opts = {}) => {
    return api.fetch(opts).then(res => commit('reset', res));
  };

  const save = ({ state, commit }, model) => {
    if (!model._cid) model._cid = cuid();
    model._synced = false;
    model._version = Date.now();
    // Create or update model locally.
    commit('save', model);
    return api.save(model).then(model => {
      // Check if new change happened locally during api call.
      // Do not update meta if there is newer change.
      const previous = state.items[model._cid];
      if (previous && previous._version === model._version) model._synced = true;
      commit('save', model);
    });
  };

  const update = ({ commit }, model) => {
    const cid = model._cid;
    const changes = { ...model };
    delete changes._cid;
    return api.update(cid, changes)
      .then(updated => commit('save', { ...model, ...updated }));
  };

  const remove = ({ commit }, model) => {
    if (!model.id && !model._version) {
      commit('remove', [model]);
      return Promise.resolve(true);
    }
    return api.remove(model).then(() => commit('remove', [model]));
  };

  const setEndpoint = ({ state, commit }, apiUrl) => {
    if (state.$apiUrl !== apiUrl) {
      api.baseUrl = apiUrl;
      commit('setEndpoint', apiUrl);
    }
  };

  return {
    api,
    fetch,
    filter,
    get,
    remove,
    reset,
    save,
    setEndpoint,
    update
  };
}
