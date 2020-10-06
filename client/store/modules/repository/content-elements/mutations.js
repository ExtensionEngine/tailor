import {
  add,
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
} from '@/store/helpers/mutations';

const reorder = (state, { element, position }) => {
  state.items[element.uid].position = position;
};

export { add, fetch, remove, reorder, reset, save, setEndpoint, update };
