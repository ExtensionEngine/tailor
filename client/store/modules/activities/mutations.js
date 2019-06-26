import {
  add,
  fetch,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/mutations';

const reorder = (state, { activity, position }) => {
  activity.position = position;
};

export { fetch, reset, add, save, remove, reorder, update, setBaseUrl };
