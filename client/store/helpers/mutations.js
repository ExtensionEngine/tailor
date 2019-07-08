import cuid from 'cuid';
import each from 'lodash/each';
import Vue from 'vue';

export const fetch = (state, items) => {
  each(items, it => Vue.set(state.items, it._cid, it));
};

export const reset = (state, items = {}) => {
  state.items = items;
};

export const add = (state, model) => {
  const _cid = model._cid || cuid();
  Vue.set(state.items, _cid, { ...model, _cid });
};

export const save = (state, model) => {
  Vue.set(state.items, model._cid, model);
};

export const remove = (state, models) => {
  models.forEach(it => Vue.delete(state.items, it._cid));
};

export const setEndpoint = (state, url) => {
  state.$apiUrl = url;
};
