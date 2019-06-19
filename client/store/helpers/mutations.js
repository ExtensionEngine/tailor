import cuid from 'cuid';
import each from 'lodash/each';
import Resource from './resource';
import Vue from 'vue';

export default function ($apiUrl) {
  let api = new Resource($apiUrl);

  const fetch = (state, result) => {
    each(result, it => {
      // TODO: Extract api unrelated methods
      api.setCid(it);
      Vue.set(state.items, it._cid, it);
    });
  };

  const reset = (state, result) => {
    state.items = result;
  };

  const add = (state, model) => {
    if (!model._cid) model._cid = cuid();
    Vue.set(state.items, model._cid, model);
  };

  const save = (state, model) => {
    Vue.set(state.items, model._cid, model);
  };

  const remove = (state, result) => {
    result.forEach(it => Vue.delete(state.items, it._cid));
  };

  const update = (state, model) => {
    Vue.set(state.items, model._cid, model);
  };

  const setBaseUrl = (state, url) => {
    state.$baseUrl = url;
  };

  return {
    api,
    fetch,
    reset,
    add,
    save,
    remove,
    update,
    setBaseUrl
  };
}
