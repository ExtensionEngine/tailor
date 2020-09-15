import {
  add, fetch, remove, reset, save, setEndpoint, sseUpdate
} from '@/store/helpers/mutations';
import find from 'lodash/find';
import Vue from 'vue';

const reorder = (state, { element, position }) => {
  state.items[element._cid].position = position;
};

export const customRemove = (state, model) => {
  const item = find(state.items, { uid: model.uid });
  if (!item) return;
  Vue.delete(state.items, item._cid);
};

export { add, fetch, remove, reorder, reset, save, setEndpoint, sseUpdate };
