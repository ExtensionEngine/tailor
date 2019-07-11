import each from 'lodash/each';
import Vue from 'vue';

export const fetch = (state, items) => {
  each(items, it => Vue.set(state.items, it.uid, it));
};

export const reset = (state, items = {}) => {
  state.items = items;
};

export const add = (state, model) => {
  const uid = model.uid;
  Vue.set(state.items, uid, { ...model });
};

export const save = (state, model) => {
  Vue.set(state.items, model.uid, model);
};

export const remove = (state, models) => {
  models.forEach(it => Vue.delete(state.items, it.uid));
};

export const setEndpoint = (state, url) => {
  state.$apiUrl = url;
};
