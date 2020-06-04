import generateActions from '@/store/helpers/actions';

const { fetch, reset, save, setEndpoint, update, remove } = generateActions();

export {
  fetch,
  remove,
  reset,
  save,
  setEndpoint,
  update
};
