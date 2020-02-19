import {
  add, fetch, remove, reset, save, setEndpoint
} from '@/store/helpers/mutations';

const reorder = (state, { element, position }) => {
  state.items[element._cid].position = position;
};

export { add, fetch, remove, reorder, reset, save, setEndpoint };
