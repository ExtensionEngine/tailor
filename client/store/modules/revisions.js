import VuexCollection from '../helpers/collection.js';

const { state, build, getter, action, mutation } = new VuexCollection('revisions');
const PAGINATION_DEFAULTS = { offset: 0, limit: 25 };

state({
  search: '',
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    allRevisionsFetched: false
  }
});

getter(function revisions() {
  return this.state.items;
}, { global: true });

getter(function revisionQueryParams() {
  const { pagination } = this.state.$internals;
  const search = this.state.search;
  return {
    search,
    offset: pagination.offset,
    limit: pagination.limit
  };
}, { global: true });

getter(function hasMoreResults() {
  return !this.state.$internals.allRevisionsFetched;
});

action(function fetch() {
  const params = this.getters.revisionQueryParams;
  return this.api.get('', params).then(response => {
    const { data: revisions } = response.data;

    let result = {};
    revisions.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', { offset: params.offset + params.limit });
    this.commit('allRevisionsFetched', revisions.length < params.limit);
    this.commit(params.search ? 'reset' : 'fetch', result);
  });
});

mutation(function resetPagination() {
  this.state.$internals.pagination = PAGINATION_DEFAULTS;
});

mutation(function setPagination(changes) {
  let $internals = this.state.$internals;
  $internals.pagination = { ...$internals.pagination, ...changes };
});

mutation(function setSearch(search) {
  this.state.search = search;
});

mutation(function allRevisionsFetched(allFetched) {
  this.state.$internals.allRevisionsFetched = allFetched;
});

export default build();
