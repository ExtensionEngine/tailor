import { add, fetch, remove, reset, save, setEndpoint } from '../../helpers/mutations';

const reorder = (state, { activity, position }) => {
  state.items[activity.uid].position = position;
};

export { add, fetch, remove, reorder, reset, save, setEndpoint };
