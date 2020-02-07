import generateActions from '../../../helpers/actions';

const { api, get, remove, reset, save, setEndpoint } = generateActions();
const PAGINATION_DEFAULTS = { offset: 0, limit: 25 };

const fetch = ({ getters: { revisionQueryParams: params }, commit }) => {
  return api.fetch(params).then(revisions => {
    commit('setPagination', { offset: params.offset + params.limit });
    commit('allRevisionsFetched', Object.keys(revisions).length < params.limit);
    commit('fetch', revisions);
  });
};

const resetPagination = ({ commit }) => {
  commit('setPagination', PAGINATION_DEFAULTS);
  commit('reset');
};

export { get, fetch, remove, reset, resetPagination, save, setEndpoint };
