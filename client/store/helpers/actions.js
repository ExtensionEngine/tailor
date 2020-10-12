import Resource from './resource';
import uuid from '@/utils/uuid';

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

  const add = ({ commit }, model) => {
    const payload = model.uid ? model : { ...model, uid: uuid() };
    commit('add', payload);
  };

  const save = ({ state, commit }, model) => {
    if (!model.uid) model.uid = uuid();
    model._synced = false;
    model._version = Date.now();
    // Create or update model locally.
    commit('save', model);
    return api.save(model).then(model => {
      // Check if new change happened locally during api call.
      // Do not update meta if there is newer change.
      const previous = state.items[model.uid];
      if (previous && previous._version === model._version) model._synced = true;
      commit('save', model);
      return model;
    });
  };

  const update = ({ commit }, model) => {
    const changes = { ...model };
    const uid = model.uid;
    delete changes.uid;
    return api.update(uid, changes)
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
    add,
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
