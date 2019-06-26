import cuid from 'cuid';
import each from 'lodash/each';
import Vue from 'vue';

export const fetch = (state, result) => {
  each(result, it => {
    // TODO: Extract api unrelated methods
    state.api.setCid(it);
    Vue.set(state.items, it._cid, it);
  });
};

export const reset = (state, result) => {
  state.items = result;
};

export const add = (state, model) => {
  if (!model._cid) model._cid = cuid();
  Vue.set(state.items, model._cid, model);
};

export const save = (state, model) => Vue.set(state.items, model._cid, model);

export const remove = (state, result) => {
  result.forEach(it => Vue.delete(state.items, it._cid));
};

export const update = (state, model) => Vue.set(state.items, model._cid, model);

export const setBaseUrl = (state, url) => {
  state.api.baseUrl = url;
};
