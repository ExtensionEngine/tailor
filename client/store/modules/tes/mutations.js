import { add, fetch, remove, reset, save, setBaseUrl, update } from '../../helpers/mutations';

const reorder = (state, { element, position }) => {
  element.position = position;
};

export { fetch, reset, add, save, remove, reorder, update, setBaseUrl };
