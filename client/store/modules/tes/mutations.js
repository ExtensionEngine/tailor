import {
  add,
  fetch,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/mutations';

const reorder = ({ element, position }) => {
  element.position = position;
};

export { fetch, reset, add, save, remove, reorder, update, setBaseUrl };
