import {
  add,
  fetch,
  remove,
  reset,
  save,
  setBaseUrl,
  update
} from '../../helpers/mutations';

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
