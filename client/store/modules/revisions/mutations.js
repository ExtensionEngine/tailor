import { add, fetch, reset, save, setEndpoint } from '../../helpers/mutations';

const setPagination = (state, changes) => {
  const $internals = state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
};

const allRevisionsFetched = (state, allFetched) => {
  state.$internals.allRevisionsFetched = allFetched;
};

export {
  add,
  allRevisionsFetched,
  fetch,
  reset,
  save,
  setEndpoint,
  setPagination
};
