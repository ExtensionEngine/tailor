import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';
import find from 'lodash/find';
import Vue from 'vue';

const reorder = (state, { element, position }) => {
  state.items[element.uid].position = position;
};

export const customRemove = (state, model) => {
  const item = find(state.items, { uid: model.uid });
  if (!item) return;
  Vue.delete(state.items, item.uid);
};

export { add, fetch, remove, reorder, reset, save, setEndpoint, update };
