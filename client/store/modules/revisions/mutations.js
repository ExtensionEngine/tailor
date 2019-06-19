import generateMutations from '../../helpers/mutations';

const { fetch, reset, add, save, remove, update, setBaseUrl } = generateMutations();

const setPagination = (state, changes) => {
  let $internals = state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
};

const allRevisionsFetched = (state, allFetched) => {
  state.$internals.allRevisionsFetched = allFetched;
};

export {
  allRevisionsFetched,
  fetch,
  reset,
  add,
  save,
  remove,
  setPagination,
  update,
  setBaseUrl
};
