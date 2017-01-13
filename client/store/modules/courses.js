import VuexModel from '../helpers/model.js';

const { state, getter, action, mutation, build } = new VuexModel('courses', '/courses');
const PAGINATION_DEFAULTS = { next: 1, limit: 20 };

state({
  search: '',
  $internals: {
    pagination: PAGINATION_DEFAULTS,
    sort: {
      order: 'DESC',
      field: '_key'
    }
  }
});

getter(function courses() {
  return this.state.items;
}, { global: true });

getter(function courseQueryParams() {
  const { pagination, sort } = this.state.$internals;
  const search = this.state.search;

  return {
    search,
    limit: pagination.limit,
    sortOrder: sort.order,
    sortBy: sort.field
  };
}, { global: true });

getter(function hasMoreResults() {
  return !!this.state.$internals.pagination.next;
});

action(function fetch(nextPage = false) {
  let queryParams = this.getters.courseQueryParams;
  if (nextPage) queryParams.page = this.state.$internals.pagination.next;

  return this.api.get('', queryParams).then(response => {
    const { data: courses, page: pagination } = response.data;

    let result = {};
    courses.forEach(it => {
      this.api.setCid(it);
      result[it._cid] = it;
    });

    this.commit('setPagination', pagination);
    this.commit(queryParams.search ? 'reset' : 'fetch', result);
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

export default build();
