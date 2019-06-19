import generateActions from '../../helpers/actions';

const { api, get, reset, save, remove, update, setBaseUrl } = generateActions();

const PAGINATION_DEFAULTS = { offset: 0, limit: 25 };

const fetch = ({ getters, commit }) => {
  const params = getters.revisionQueryParams;
  return api.get('', params).then(response => {
    const { data: revisions } = response.data;

    let result = {};
    revisions.forEach(it => {
      api.setCid(it);
      result[it._cid] = it;
    });

    commit('setPagination', { offset: params.offset + params.limit });
    commit('allRevisionsFetched', revisions.length < params.limit);
    commit('fetch', result);
  });
};

const resetPagination = ({ commit }) => {
  commit('setPagination', PAGINATION_DEFAULTS);
  commit('reset', {});
};

export { get, fetch, remove, reset, save, update, resetPagination, setBaseUrl };
