import each from 'lodash/each';
import omit from 'lodash/omit';
import uuid from '@/utils/uuid';
import Vue from 'vue';

export const fetch = (state, items) => {
  each(items, it => Vue.set(state.items, it.uid, it));
};

export const reset = (state, items = {}) => {
  state.items = items;
};

export const add = (state, model) => {
  const existing = state.items[model.uid];
  if (existing) return update(state, model);
  const uid = uuid();
  Vue.set(state.items, uid, { ...model, uid });
};

export const update = (state, model) => {
  const existing = state.items[model.uid];
  if (!existing) return;
  Vue.set(state.items, existing.uid, { ...existing, ...omit(model, 'uid') });
};

export const save = (state, model) => {
  const existing = state.items[model.uid];
  if (existing) return update(state, model);
  Vue.set(state.items, model.uid, model);
};

export const remove = (state, models) => {
  models.forEach(it => Vue.delete(state.items, it.uid));
};

export const setEndpoint = (state, url) => {
  state.$apiUrl = url;
};
